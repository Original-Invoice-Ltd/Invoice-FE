"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import ColorPicker from "@/components/ColorPicker/ColorPicker";
import PaymentTermsDropdown from "@/components/invoice/PaymentTermsDropdown";
import AddProductModal from "@/components/productManagement/AddProductModal";
import CountryDropdown from "@/components/common/CountryDropdown";
import TemplateSelector from "@/components/invoice/TemplateSelector";
import { ApiClient } from "@/lib/api";
import { buildInvoiceFormData, dataURLtoFile, base64ToFile, CreateInvoiceData, InvoiceItem } from "@/lib/invoiceTypes";
import { Product } from "@/lib/productCache";
import { useInvoiceLimit } from "@/contexts/InvoiceLimitContext";
import { useInvoiceLimitNotification } from "@/hooks/useInvoiceLimitNotification";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import { useDraft } from "@/hooks/useDraft";
import { useTranslation } from "react-i18next";

const CreateInvoicePage = () => {
    const { t } = useTranslation();
    const {
        canCreateInvoice,
        invoicesRemaining,
        totalInvoices,
        isLoading: limitLoading,
    } = useInvoiceLimit();
    const { showBlockedNotification: showBlockedNotif } = useInvoiceLimitNotification();
    const { toast, showError, showSuccess, hideToast } = useToast();
    const { loadDraft, saveDraft, sendDraft, hasDraft, isLoadingDraft, isSavingDraft, loadedDraftData } = useDraft();

    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isSendingInvoice, setIsSendingInvoice] = useState(false);
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [clients, setClients] = useState<{ id: string; fullName: string; email: string; businessName: string }[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [clientsLoaded, setClientsLoaded] = useState(false);
    const [isSavingClient, setIsSavingClient] = useState(false);

    // New client form state
    const [newClientForm, setNewClientForm] = useState({
        customerType: "",
        title: "Mr",
        fullName: "",
        businessName: "",
        phone: "",
        email: "",
        country: ""
    });
    const [clientFormError, setClientFormError] = useState<string | null>(null);
    const [formValidationError, setFormValidationError] = useState<string | null>(null);

    // Field-specific validation errors
    const [fieldErrors, setFieldErrors] = useState({
        billFromFullName: '',
        billFromEmail: '',
        billFromPhone: '',
        billFromBusinessName: '',
        billFromAddress: '',
        billToCustomer: '',
        billToTitle: '',
        billToInvoiceDate: '',
        billToDueDate: '',
        items: '',
        paymentBank: '',
        paymentAccountName: '',
        paymentAccountNumber: ''
    });

    const [showProductsDropdown, setShowProductsDropdown] = useState(false);
    const [products, setProducts] = useState<{ id: string; itemName: string; quantity: number; rate: number; amount: number }[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productsLoaded, setProductsLoaded] = useState(false);

    const [showAddProductModal, setShowAddProductModal] = useState(false);

    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [bankSearchQuery, setBankSearchQuery] = useState("");

    const nigerianBanks = [
        { category: "Fintechs", banks: ["OPay", "PalmPay", "Moniepoint", "Kuda Bank", "Carbon", "Fairmoney"] },
        { category: "Commercial Banks", banks: ["Access Bank", "Zenith Bank", "GTBank", "First Bank", "UBA", "Fidelity Bank", "Union Bank", "Stanbic IBTC", "Sterling Bank", "Ecobank", "FCMB", "Wema Bank", "Polaris Bank", "Keystone Bank", "Unity Bank"] }
    ];

    const loadProducts = async () => {
        if (productsLoaded || isLoadingProducts) return;
        try {
            setIsLoadingProducts(true);
            const response = await ApiClient.getAllUserProducts();
            if (response.status === 200) {
                const productsData = Array.isArray(response.data) ? response.data : [];
                setProducts(productsData);
                setProductsLoaded(true);
            } else {
                console.error('Failed to load products:', response.error);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleProductsDropdownClick = () => {
        if (!showProductsDropdown) {
            loadProducts();
        }
        setShowProductsDropdown(!showProductsDropdown);
    };

    const handleSelectProduct = (product: { id: string; itemName: string; quantity: number; rate: number; amount: number }) => {
        const newItem: InvoiceItem = {
            id: Date.now(),
            itemName: product.itemName,
            quantity: product.quantity || 1,
            rate: product.rate || 0,
            amount: (product.quantity || 1) * (product.rate || 0)
        };
        setItems([...items, newItem]);
        setShowProductsDropdown(false);
    };

    const loadClients = async () => {
        if (clientsLoaded || isLoadingClients) return;

        try {
            setIsLoadingClients(true);
            const response = await ApiClient.getAllUserClients();

            if (response.status === 200) {
                const clientsData = Array.isArray(response.data) ? response.data : [];
                setClients(clientsData);
                setClientsLoaded(true);
            } else {
                console.error('Failed to load clients:', response.error);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setIsLoadingClients(false);
        }
    };

    const handleClientDropdownClick = () => {
        if (!showClientDropdown) {
            loadClients();
        }
        setShowClientDropdown(!showClientDropdown);
    };

    const handleSaveNewClient = async () => {
        setClientFormError(null);
        if (!newClientForm.customerType || !newClientForm.title || !newClientForm.fullName ||

            !newClientForm.businessName || !newClientForm.email || !newClientForm.phone) {
            setClientFormError('Please fill in all required fields');
            return;
        }

        try {
            setIsSavingClient(true);
            const response = await ApiClient.addClient(newClientForm);

            if (response.status === 201) {
                // Close modal and reset form
                setShowAddClientModal(false);
                setNewClientForm({
                    customerType: "",
                    title: "Mr",
                    fullName: "",
                    businessName: "",
                    phone: "",
                    email: "",
                    country: ""
                });
                // Refresh clients list
                setClientsLoaded(false);
                await loadClients();
            } else {
                console.error('Failed to add client:', response.error);
                setClientFormError(response.error || 'Failed to add client');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            setClientFormError('An error occurred while saving the client');
        } finally {
            setIsSavingClient(false);
        }
    };

    const [billFrom, setBillFrom] = useState({
        fullName: "",
        email: "",
        address: "",
        phoneNumber: "",
        businessName: ""
    });

    const [billTo, setBillTo] = useState({
        customer: "",
        title: "",
        invoiceNumber: "",
        paymentTerms: "",
        invoiceDate: "",
        dueDate: ""
    });

    const [customerNote, setCustomerNote] = useState("");
    const [termsAndConditions, setTermsAndConditions] = useState("");
    const [currency, setCurrency] = useState("NGN");
    const [language, setLanguage] = useState("English");
    const [color, setColor] = useState("#2F80ED");
    const [template, setTemplate] = useState("default");
    const [logo, setLogo] = useState<string | null>(null);

    const [paymentDetails, setPaymentDetails] = useState({
        bankAccount: "",
        accountName: "",
        accountNumber: ""
    });

    const [vat, setVat] = useState(7.5);
    const [wht, setWht] = useState(5);
    const [invoiceTaxRate, setInvoiceTaxRate] = useState(7.5);

    const hasFormChanges = () => {
        const hasBillFromChanges = billFrom.fullName.trim() !== "" ||
            billFrom.email.trim() !== "" ||
            billFrom.address.trim() !== "" ||
            billFrom.phoneNumber.trim() !== "" ||
            billFrom.businessName.trim() !== "";

        const hasBillToChanges = billTo.customer.trim() !== "" ||
            billTo.title.trim() !== "" ||
            billTo.invoiceNumber.trim() !== "" ||
            billTo.paymentTerms.trim() !== "" ||
            billTo.invoiceDate.trim() !== "" ||
            billTo.dueDate.trim() !== "";

        const hasItems = items.length > 0;

        const hasAdditionalChanges = customerNote.trim() !== "" ||
            termsAndConditions.trim() !== "" ||
            logo !== null ||
            signature !== null;

        const hasPaymentDetails = paymentDetails.bankAccount.trim() !== "" ||
            paymentDetails.accountName.trim() !== "" ||
            paymentDetails.accountNumber.trim() !== "";

        const hasNonDefaultSettings = currency !== "NGN" ||
            language !== "English" ||
            color !== "#2F80ED" ||
            template !== "default" ||
            vat !== 7.5 ||
            wht !== 5 ||
            invoiceTaxRate !== 0 ||
            selectedClientId.trim() !== "";

        return hasBillFromChanges || hasBillToChanges || hasItems || hasAdditionalChanges || hasPaymentDetails || hasNonDefaultSettings;
    };

    const addNewRow = () => {
        setShowAddProductModal(true);
    };

    const handleProductSave = (product: Product) => {
        const newItem: InvoiceItem = {
            id: Date.now(),
            itemName: product.itemName,
            quantity: product.quantity || 1,
            rate: product.rate || 0,
            amount: product.amount || ((product.quantity || 1) * (product.rate || 0))
        };
        setItems([...items, newItem]);
        setShowAddProductModal(false);
    };

    const removeRow = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'rate') {
                    updated.amount = updated.quantity * updated.rate;
                }
                return updated;
            }
            return item;
        }));
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateTax = () => {
        const subtotal = calculateSubtotal();
        return subtotal * invoiceTaxRate / 100;
    };
    const calculateWht = () => {
        const subtotal = calculateSubtotal();
        return subtotal * 5 / 100;
    };


    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax() + calculateWht();
    };

    // const isFormValid = () => {
    //     const billFromValid = billFrom.fullName.trim() !== "" &&
    //         ApiClient.isValidEmail(billFrom.email.trim()) &&
    //         ApiClient.isValidPhone(billFrom.phoneNumber.trim()) &&
    //         billFrom.businessName.trim() !== "";

    //     const billToValid = billTo.customer.trim() !== "" &&
    //         billTo.title.trim() !== "" &&
    //         billTo.invoiceDate.trim() !== "" &&
    //         billTo.dueDate.trim() !== "";

    //     const itemsValid = items.length > 0;

    //     const paymentDetailsValid = paymentDetails.bankAccount.trim() !== "" &&
    //         paymentDetails.accountName.trim() !== "" &&
    //         paymentDetails.accountNumber.trim() !== "";

    //     return billFromValid && billToValid && itemsValid && paymentDetailsValid;
    // };

    const validateFormAndGetErrors = () => {
        const errors = {
            billFrom: '',
            billTo: '',
            payment: '',
            items: ''
        };

        const newFieldErrors = {
            billFromFullName: '',
            billFromEmail: '',
            billFromPhone: '',
            billFromBusinessName: '',
            billFromAddress: '',
            billToCustomer: '',
            billToTitle: '',
            billToInvoiceDate: '',
            billToDueDate: '',
            items: '',
            paymentBank: '',
            paymentAccountName: '',
            paymentAccountNumber: ''
        };

        if (billFrom.fullName.trim() === "") {
            errors.billFrom = "Sender's Full name is required";
            newFieldErrors.billFromFullName = "Full name is required";
        } else if (billFrom.email.trim() === "") {
            errors.billFrom = "Sender's Email is required";
            newFieldErrors.billFromEmail = "Email is required";
        } else if (!ApiClient.isValidEmail(billFrom.email)) {
            errors.billFrom = "Invalid Sender's email provided";
            newFieldErrors.billFromEmail = "Invalid email format";
        }
        else if (billFrom.phoneNumber.trim() === "") {
            errors.billFrom = "Sender's Phone number is required";
            newFieldErrors.billFromPhone = "Phone number is required";
        } else if (billFrom.businessName.trim() === "") {
            errors.billFrom = "Sender's Business name is required";
            newFieldErrors.billFromBusinessName = "Business name is required";
        }

        if (billTo.customer.trim() === "") {
            errors.billTo = "Please select a customer";
            newFieldErrors.billToCustomer = "Please select a customer";
        } else if (billTo.invoiceDate.trim() === "") {
            errors.billTo = "Invoice date is required";
            newFieldErrors.billToInvoiceDate = "Invoice date is required";
        } else if (billTo.dueDate.trim() === "") {
            errors.billTo = "Due date is required";
            newFieldErrors.billToDueDate = "Due date is required";
        }
        else if (new Date(billTo.dueDate) < new Date(billTo.invoiceDate)) {
            console.log(new Date(billTo.dueDate) < new Date(billTo.invoiceDate), " s")
            errors.billTo = "Due date must be on or after invoice date";
            newFieldErrors.billToDueDate = "Due date must be on or after invoice date";
        }

        if (items.length === 0) {
            errors.items = "Add at least one item to the invoice";
            newFieldErrors.items = "Add at least one item to the invoice";
        }

        if (paymentDetails.bankAccount.trim() === "") {
            errors.payment = "Bank account is required";
            newFieldErrors.paymentBank = "Bank account is required";
        } else if (paymentDetails.accountName.trim() === "") {
            errors.payment = "Account name is required";
            newFieldErrors.paymentAccountName = "Account name is required";
        } else if (!/^\d+$/.test(paymentDetails.accountNumber)) {
            errors.payment = "Invalid Account Number provided";
            newFieldErrors.paymentAccountNumber = "Invalid account number";
        }

        setFieldErrors(newFieldErrors);
        return errors;
    };

    const getFirstValidationError = (): string | null => {
        const errors = validateFormAndGetErrors();
        const keys: (keyof typeof errors)[] = ['billFrom', 'billTo', 'payment', 'items'];

        for (const key of keys) {
            if (errors[key] && errors[key].trim() !== '') {
                return errors[key];
            }
        }

        return null;
    };

    const getSpecificValidationMessage = (): string | null => {
        if (billFrom.fullName.trim() === "") {
            return "Sender's full name is required";
        }
        if (billFrom.email.trim() === "") {
            return "Sender's email is required";
        }
        if (billFrom.phoneNumber.trim() === "") {
            return "Phone number is required";
        }
        if (billFrom.businessName.trim() === "") {
            return "Business name is required";
        }

        if (billTo.customer.trim() === "") {
            return "Customer selection is required";
        }
        if (billTo.title.trim() === "") {
            return "Invoice number is required";
        }
        if (billTo.invoiceDate.trim() === "") {
            return "Invoice date is required";
        }
        if (billTo.dueDate.trim() === "") {
            return "Due date is required";
        }

        if (items.length === 0) {
            return "At least one item is required";
        }

        if (paymentDetails.bankAccount.trim() === "") {
            return "Bank account is required";
        }
        if (paymentDetails.accountName.trim() === "") {
            return "Account name is required";
        }
        if (paymentDetails.accountNumber.trim() === "") {
            return "Account number is required";
        }

        return null;
    };

    const handleSaveDraft = async () => {
        setFormValidationError(null);

        const draftData = {
            billFrom,
            billTo,
            items,
            customerNote,
            termsAndConditions,
            currency,
            language,
            color,
            template,
            logo,
            signature,
            paymentDetails,
            vat,
            wht,
            selectedClientId,
            invoiceTaxRate
        };

        const result = await saveDraft(draftData);

        if (result.success) {
            showSuccess('Draft saved successfully');
            setTimeout(() => hideToast(), 2000);
        } else {
            showError(result.error || 'Failed to save draft');
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [showSignatureModal]);

    useEffect(() => {
        const loadSavedDraft = async () => {
            try {
                await loadDraft();
            } catch (error) {
                throw new Error('Error loading draft:' );
            }
        };

        loadSavedDraft();
    }, [loadDraft]);

    useEffect(() => {
        if (!isLoadingDraft && loadedDraftData) {
            setBillFrom(loadedDraftData.billFrom);
            setBillTo(loadedDraftData.billTo);

            if (loadedDraftData.selectedClientId) {
                setSelectedClientId(loadedDraftData.selectedClientId);
            }

            setItems(loadedDraftData.items);

            setCurrency(loadedDraftData.currency);
            setLanguage(loadedDraftData.language);
            setColor(loadedDraftData.color);
            setTemplate(loadedDraftData.template);
            setCustomerNote(loadedDraftData.customerNote);
            setTermsAndConditions(loadedDraftData.termsAndConditions);

            setPaymentDetails(loadedDraftData.paymentDetails);

            setVat(loadedDraftData.vat);
            setWht(loadedDraftData.wht);
            setInvoiceTaxRate(loadedDraftData.invoiceTaxRate);

            if (loadedDraftData.logo) {
                setLogo(loadedDraftData.logo);
            }
            if (loadedDraftData.signature) {
                setSignature(loadedDraftData.signature);
            }
        }
    }, [loadedDraftData, isLoadingDraft]);

    useEffect(() => {
        if (loadedDraftData?.selectedClientId && !clientsLoaded) {
            loadClients();
        }
    }, [loadedDraftData?.selectedClientId, clientsLoaded]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL();
        setSignature(dataUrl);
        setShowSignatureModal(false);
    };

    const handlePreviewInvoice = () => {
        if (invoicesRemaining === 0) {
            showError("Upgrade plan to create more invoices");
            return;
        }
        if (!canCreateInvoice) {
            window.location.href = '/dashboard/pricing';
            return;
        }

        const currentError = getFirstValidationError();

        if (currentError) {
            setFormValidationError(currentError);
            showError(currentError);
            return;
        }

        setFormValidationError(null);
        setShowPreview(true);
    };
    // const getPreviewData = () => {
    //     const selectedClient = clients.find(client => client.id === selectedClientId);

    //     return {
    //         id: "preview",
    //         title: billTo.title || "Invoice",
    //         invoiceNumber: billTo.title || "INV-PREVIEW",
    //         creationDate: billTo.invoiceDate,
    //         dueDate: billTo.dueDate,
    //         currency: currency,
    //         invoiceColor: color,
    //         status: "DRAFT" as const,
    //         subtotal: items.reduce((sum, item) => sum + item.amount, 0),
    //         totalTaxAmount: calculateTax(),
    //         totalDue: calculateTotal(),
    //         logoUrl: logo || undefined,
    //         signatureUrl: signature || undefined,
    //         note: customerNote,
    //         termsAndConditions: termsAndConditions,
    //         paymentTerms: billTo.paymentTerms,
    //         bank: paymentDetails.bankAccount,
    //         accountNumber: paymentDetails.accountNumber,
    //         accountName: paymentDetails.accountName,
    //         billFrom: {
    //             fullName: billFrom.fullName,
    //             email: billFrom.email,
    //             phone: billFrom.phoneNumber,
    //             address: billFrom.address
    //         },
    //         billTo: {
    //             id: "preview-client",
    //             customerType: "",
    //             title: "",
    //             fullName: billTo.customer,
    //             businessName: billTo.customer,
    //             email: selectedClient?.email || "",
    //             phone: "",
    //             country: ""
    //         },
    //         items: items.map(item => ({
    //             id: item.id,
    //             itemName: item.itemName,
    //             quantity: item.quantity,

    //             rate: item.rate,
    //             amount: item.amount,
    //             description: ""
    //         })),
    //         appliedTaxes: []
    //     };
    // };

    const handleBackToEdit = () => {
        setFormValidationError(null);
        hideToast()
        setShowPreview(false);
    };

    const handleSendInvoice = async (): Promise<{ success: boolean; error?: string }> => {

        const error = getFirstValidationError();
        if (!canCreateInvoice) {
            showBlockedNotif();
            return { success: false, error: "Invoice limit reached" };
        }
        if (error) {
            setFormValidationError(error);
            showError(error);
            return { success: false, error: getFirstValidationError() as string };
        }
        setFormValidationError(null);
        setShowPreview(true);

        try {
            setIsSendingInvoice(true);

            if (hasDraft) {
                const result = await sendDraft();

                if (result.success) {
                    setTimeout(() => {
                        window.location.href = '/dashboard/invoices';
                    }, 1500);
                    return { success: true };
                } else {
                    setFormValidationError(result.error || 'Failed to send invoice');
                    return { success: false, error: result.error || 'Failed to send invoice' };
                }
            }

            // Otherwise, create new invoice
            // Prepare logo file from base64 if exists
            let logoFile: File | null = null;
            if (logo) {
                logoFile = base64ToFile(logo, 'logo.png');
            }

            // Prepare signature file from base64 if exists
            let signatureFile: File | null = null;
            if (signature) {
                signatureFile = dataURLtoFile(signature, 'signature.png');
            }

            // Calculate totals
            const subtotal = calculateSubtotal();
            const totalDue = calculateTotal();

            const invoiceData: CreateInvoiceData = {
                logo: logoFile,
                billFrom: {
                    fullName: billFrom.fullName,
                    email: billFrom.email,
                    address: billFrom.address,
                    phoneNumber: billFrom.phoneNumber.startsWith('+234') ? billFrom.phoneNumber : `+234${billFrom.phoneNumber.replace(/^0/, '')}`,
                    businessName: billFrom.businessName,
                },
                billTo: {
                    clientId: selectedClientId,
                    title: billTo.title,
                    invoiceNumber: billTo.invoiceNumber,
                    paymentTerms: billTo.paymentTerms,
                    invoiceDate: billTo.invoiceDate,
                    dueDate: billTo.dueDate,
                },
                items: items.map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                })),
                note: customerNote,
                termsAndConditions: termsAndConditions,
                signature: signatureFile,
                language: language,
                currency: currency,
                invoiceColor: color,
                subtotal: subtotal,
                totalDue: totalDue,
                paymentDetails: {
                    accountNumber: paymentDetails.accountNumber,
                    accountName: paymentDetails.accountName,
                    bank: paymentDetails.bankAccount,
                },
            };

            const formData = buildInvoiceFormData(invoiceData);

            const response = await ApiClient.createInvoice(formData);

            if (response.status === 201 || response.status === 200) {
                setTimeout(() => {
                    window.location.href = '/dashboard/invoices';
                }, 1500);
                return { success: true };
            } else {
                setFormValidationError(response.error || 'Failed to create invoice');
                return { success: false, error: response.error || 'Failed to create invoice' };
            }
        } catch (error) {
            setFormValidationError('An unexpected error occurred while sending the invoice.');
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsSendingInvoice(false);
        }
    };

    const handleSendWhatsApp = async (phoneNumber: string, message?: string): Promise<{ success: boolean; error?: string }> => {
        const error = getFirstValidationError();
        if (!canCreateInvoice) {
            showBlockedNotif();
            return { success: false, error: "Invoice limit reached" };
        }
        if (error) {
            setFormValidationError(error);
            showError(error);
            return { success: false, error: getFirstValidationError() as string };
        }
        setFormValidationError(null);

        try {
            setIsSendingInvoice(true);

            if (hasDraft) {
                // Send draft invoice via WhatsApp
                const result = await ApiClient.sendDraftWhatsApp(phoneNumber, message);

                if (result.status === 200 || result.status === 201) {
                    setTimeout(() => {
                        window.location.href = '/dashboard/invoices';
                    }, 1500);
                    return { success: true };
                } else {
                    setFormValidationError(result.error || 'Failed to send invoice via WhatsApp');
                    return { success: false, error: result.error || 'Failed to send invoice via WhatsApp' };
                }
            }

            // Otherwise, create new invoice and send via WhatsApp
            let logoFile: File | null = null;
            if (logo) {
                logoFile = base64ToFile(logo, 'logo.png');
            }

            let signatureFile: File | null = null;
            if (signature) {
                signatureFile = dataURLtoFile(signature, 'signature.png');
            }

            const subtotal = calculateSubtotal();
            const totalDue = calculateTotal();

            const invoiceData: CreateInvoiceData = {
                logo: logoFile,
                billFrom: {
                    fullName: billFrom.fullName,
                    email: billFrom.email,
                    address: billFrom.address,
                    phoneNumber: billFrom.phoneNumber,
                    businessName: billFrom.businessName,
                },
                billTo: {
                    clientId: selectedClientId,
                    title: billTo.title,
                    invoiceNumber: billTo.invoiceNumber,
                    paymentTerms: billTo.paymentTerms,
                    invoiceDate: billTo.invoiceDate,
                    dueDate: billTo.dueDate,
                },
                items: items.map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                })),
                note: customerNote,
                termsAndConditions: termsAndConditions,
                signature: signatureFile,
                language: language,
                currency: currency,
                invoiceColor: color,
                subtotal: subtotal,
                totalDue: totalDue,
                paymentDetails: {
                    accountNumber: paymentDetails.accountNumber,
                    accountName: paymentDetails.accountName,
                    bank: paymentDetails.bankAccount,
                },
            };

            const formData = buildInvoiceFormData(invoiceData);

            const response = await ApiClient.sendInvoiceWhatsApp(formData, phoneNumber, message);

            if (response.status === 201 || response.status === 200) {
                setTimeout(() => {
                    window.location.href = '/dashboard/invoices';
                }, 1500);
                return { success: true };
            } else {
                setFormValidationError(response.error || 'Failed to send invoice via WhatsApp');
                return { success: false, error: response.error || 'Failed to send invoice via WhatsApp' };
            }
        } catch (error) {
            setFormValidationError('An unexpected error occurred while sending the invoice via WhatsApp.');
            return { success: false, error: 'An unexpected error occurred' };
        } finally {
            setIsSendingInvoice(false);
        }
    };

    if (showPreview) {
        return (
            <InvoicePreview
                data={{
                    logo,
                    billFrom,
                    billTo,
                    items: items.map(item => ({ ...item, tax: 0 })),
                    customerNote,
                    termsAndConditions,
                    signature,
                    currency,
                    language,
                    color,
                    template,
                    paymentDetails,
                    vat,
                    wht,
                    selectedClientId,
                    invoiceTaxRate
                }}
                onEdit={handleBackToEdit}
                onEmailInvoice={() => {
                }}
                onSendInvoice={handleSendInvoice}
                onSendWhatsApp={handleSendWhatsApp}
                validationMessage={getSpecificValidationMessage()}
                hasDraft={hasDraft}
            />
        );
    }

    return (
        <>
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />
            <div className="mt-[6px] md:mx-4 mx-2 p-2 md:p-6">
                <div className="mb-4 flex md:items-center justify-between items-start flex-col md:flex-row ">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/invoices" className="p-2 text-[#2F80ED] ">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-[20px] font-semibold text-[#101828] flex items-center gap-2 text-nowrap  flex flex-col md:flex-row ">
                            {t('create_invoice')}
                            {isLoadingDraft && (
                                <div className="flex items-center gap-2 text-[14px] text-[#667085]">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2F80ED]"></div>
                                    {t('loading')}...
                                </div>
                            )}
                            {hasDraft && !isLoadingDraft && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-[#F0F7FF] border border-[#2F80ED] rounded-md text-[12px] text-[#2F80ED]">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {t('draft_loaded')}
                                </div>
                            )}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${limitLoading ? 'bg-[#667085]' :
                            totalInvoices === -1 ? 'bg-[#10B981]' :
                                invoicesRemaining > 2 ? 'bg-[#10B981]' :
                                    invoicesRemaining > 0 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                            }`}></div>
                        <span className="text-[14px] font-medium text-[#344054]">
                            {limitLoading ? (
                                t('loading')
                            ) : totalInvoices === -1 ? (
                                t('unlimited_invoices')
                            ) : (
                                `${invoicesRemaining}/${totalInvoices} ${t('invoices_used_this_month')}`
                            )}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-[22px] md:mb-14">
                    <div className="w-full md:w-[630px]">
                        <div className="lg:col-span-3 bg-white rounded-lg p-4 space-y-6">
                            <div className="bg-white rounded-lg border border-[#E4E7EC] p-4 space-y-2 md:space-y-6">
                                <div>
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12">
                                        <div className="flex-shrink-0">
                                            <div className="bg-[#F8F8FA] flex items-start md:items-center justify-center border border-[#EDEDED] rounded-lg px-16 py-1">
                                                <h2 className="text-[18px] font-medium text-[#101828]">{t('invoice')}</h2>
                                            </div>
                                        </div>
                                        <div className="md:flex-1 w-full md:max-w-[200px] md:ml-auto h-[150px]">
                                            <input
                                                type="file"
                                                id="logo-upload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file && file.size <= 5 * 1024 * 1024) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setLogo(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        showError('File size must be less than 5MB');
                                                    }
                                                }}
                                            />
                                            <label htmlFor="logo-upload" className="w-full h-full block border border-dashed border-[#E5E5E5] rounded-lg py-1 px-1 text-center cursor-pointer hover:border-[#2F80ED] transition-colors">
                                                {logo ? (
                                                    // Show image preview when logo is selected
                                                    <div className="flex flex-col items-center w-full h-full">
                                                        <div className="w-full h-full rounded-lg overflow-hidden mb-2">
                                                            <img
                                                                src={logo}
                                                                alt="Business Logo"
                                                                className="w-full h-full object-cover object-contain"
                                                            />
                                                        </div>
                                                        {/* <p className="text-[10px] text-[#667085]">Click to replace</p> */}
                                                    </div>
                                                ) : (
                                                    // Show upload UI when no logo is selected
                                                    <div className="flex flex-col items-center">
                                                        <div className="border-gray-100 border border-2 p-1 w-12 h-12 rounded-lg">
                                                            <div className="mb-2 text-[#2F80ED] items-center flex  bg-gray-100 px-1 py-1 rounded-lg">
                                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M18 2.25C20.0711 2.25 21.75 3.92893 21.75 6V18C21.75 20.0711 20.0711 21.75 18 21.75H6C5.28598 21.75 4.61621 21.55 4.04688 21.2021C3.79222 21.0466 3.55825 20.861 3.34863 20.6514C2.67084 19.9736 2.25 19.0353 2.25 18V6C2.25 3.92893 3.92893 2.25 6 2.25H18ZM6 3.75C4.75736 3.75 3.75 4.75736 3.75 6V18C3.75 18.6215 4.00119 19.1828 4.40918 19.5908C4.53542 19.7171 4.67626 19.8285 4.8291 19.9219C5.16966 20.1299 5.56969 20.25 6 20.25H18C19.2426 20.25 20.25 19.2426 20.25 18V6C20.25 4.75736 19.2426 3.75 18 3.75H6ZM12.6211 10.8154C13.4764 9.92021 14.9098 10.1204 15.5176 11.1807L17.5723 14.7637C18.0473 15.5923 17.5123 16.7498 16.4551 16.75H7.54492C6.45827 16.7497 5.93366 15.5372 6.45996 14.7109L7.54004 13.0156C8.04626 12.2208 9.06446 11.9222 9.91309 12.3662L10.5293 12.6885C10.6466 12.7498 10.7915 12.732 10.8965 12.6221L12.6211 10.8154ZM14.2168 11.9268C14.0958 11.7156 13.8525 11.6985 13.7061 11.8516L11.9805 13.6582C11.4227 14.2418 10.555 14.3948 9.83398 14.0176L9.21777 13.6953C9.08415 13.6254 8.90762 13.6597 8.80469 13.8213L7.89453 15.25H16.1221L14.2168 11.9268ZM9 8C9.55228 8 10 8.44772 10 9C10 9.55228 9.55228 10 9 10C8.44772 10 8 9.55228 8 9C8 8.44772 8.44772 8 9 8Z" fill="#2F80ED" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <p className="text-[16px] font-medium text-[#101828] mb-1">Upload Business Logo</p>
                                                        <p className="text-[12px] text-[#667085]">Max file size 5MB</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-[20px] font-semibold text-[#101828] mb-2 md:mb-4">Bill From</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                value={billFrom.fullName}
                                                onChange={(e) => setBillFrom({ ...billFrom, fullName: e.target.value })}
                                                className={`w-full px-3 py-2.5 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billFromFullName ? 'border-red-500' : 'border-[#D0D5DD]'
                                                    }`}
                                            />
                                            {fieldErrors.billFromFullName && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors.billFromFullName}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        placeholder="Enter email address"
                                                        value={billFrom.email}
                                                        onChange={(e) => setBillFrom({ ...billFrom, email: e.target.value })}
                                                        className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billFromEmail ? 'border-red-500' : 'border-[#D0D5DD]'
                                                            }`}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {fieldErrors.billFromEmail && (
                                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.billFromEmail}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter address"
                                                    value={billFrom.address}
                                                    onChange={(e) => setBillFrom({ ...billFrom, address: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Phone Number <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="Enter phone number"
                                                    value={billFrom.phoneNumber}
                                                    onChange={(e) => setBillFrom({ ...billFrom, phoneNumber: e.target.value })}
                                                    className={`w-full px-3 py-2.5 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billFromPhone ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                />
                                                {fieldErrors.billFromPhone && (
                                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.billFromPhone}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Business Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter business name"
                                                    value={billFrom.businessName}
                                                    onChange={(e) => setBillFrom({ ...billFrom, businessName: e.target.value })}
                                                    className={`w-full px-3 py-2.5 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billFromBusinessName ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                />
                                                {fieldErrors.billFromBusinessName && (
                                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.billFromBusinessName}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-[20px] font-semibold text-[#101828] mb-2 md:mb-4">Bill To</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                Customer <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div
                                                    onClick={handleClientDropdownClick}
                                                    className={`w-full px-3 py-2.5 border rounded-lg text-[14px] text-[#344054] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F80ED] flex justify-between items-center ${fieldErrors.billToCustomer ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                >
                                                    <span>{billTo.customer || 'Select from added client'}</span>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>

                                                {showClientDropdown && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                                        {/* Loading State */}
                                                        {isLoadingClients && (
                                                            <div className="flex items-center justify-center py-4">
                                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F80ED]"></div>
                                                                <span className="ml-2 text-sm text-[#667085]">Loading clients...</span>
                                                            </div>
                                                        )}
                                                        {/* Empty State */}
                                                        {!isLoadingClients && clients.length === 0 && (
                                                            <div className="px-4 py-3 text-sm text-[#667085] text-center">
                                                                No clients found
                                                            </div>
                                                        )}
                                                        {/* Client List */}
                                                        {!isLoadingClients && clients.map((client) => (
                                                            <div
                                                                key={client.id}
                                                                onClick={() => {
                                                                    setBillTo({ ...billTo, customer: client.fullName });
                                                                    setSelectedClientId(client.id);
                                                                    setShowClientDropdown(false);
                                                                }}
                                                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${selectedClientId === client.id ? 'bg-[#2F80ED] text-white hover:bg-[#2F80ED]' : ''
                                                                    }`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${selectedClientId === client.id ? 'bg-white text-[#2F80ED]' : 'bg-gray-100 text-gray-600'
                                                                    }`}>

                                                                    {client.fullName?.charAt(0)?.toUpperCase() || 'C'}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className={`font-medium ${selectedClientId === client.id ? 'text-white' : 'text-gray-900'}`}>
                                                                        {client.fullName}
                                                                    </p>
                                                                    <div className="flex items-center gap-1 text-sm">
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M2.66667 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26667 1.93333 2.66667 2.66667 2.66667Z" stroke={selectedClientId === client.id ? 'white' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M14.6667 4L8 8.66667L1.33333 4" stroke={selectedClientId === client.id ? 'white' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <span className={selectedClientId === client.id ? 'text-white' : 'text-gray-600'}>{client.email}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* Add New Client Button */}
                                                        <div
                                                            onClick={() => {
                                                                setShowClientDropdown(false);
                                                                setShowAddClientModal(true);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 text-[#2F80ED] border-t border-gray-200"
                                                        >
                                                            <Plus size={20} />
                                                            <span className="font-medium">Add New Client</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {fieldErrors.billToCustomer && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors.billToCustomer}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Invoice Title
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="title"
                                                    value={billTo.title}
                                                    onChange={(e) => setBillTo({ ...billTo, title: e.target.value })}
                                                    className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Payment Terms
                                                </label>
                                                <PaymentTermsDropdown
                                                    value={billTo.paymentTerms}
                                                    onChange={(value) => setBillTo({ ...billTo, paymentTerms: value })}
                                                    placeholder="Select payment terms"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Invoice Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    min={new Date().toISOString().split('T')[0]}
                                                    type="date"
                                                    value={billTo.invoiceDate}
                                                    onChange={(e) => setBillTo({ ...billTo, invoiceDate: e.target.value })}
                                                    className={`w-full px-3 py-2.5 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billToInvoiceDate ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                />
                                                {fieldErrors.billToInvoiceDate && (
                                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.billToInvoiceDate}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[14px] font-medium text-[#344054] mb-2">
                                                    Due Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    min={new Date().toISOString().split('T')[0]}
                                                    type="date"
                                                    value={billTo.dueDate}
                                                    onChange={(e) => setBillTo({ ...billTo, dueDate: e.target.value })}
                                                    className={`w-full px-3 py-2.5 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.billToDueDate ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                />
                                                {fieldErrors.billToDueDate && (
                                                    <p className="text-red-500 text-xs mt-1">{fieldErrors.billToDueDate}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#E4E7EC] p-4">
                                <h2 className="text-[20px] font-semibold text-[#101828] mb-4">Table Item</h2>
                                {fieldErrors.items && (
                                    <p className="text-red-500 text-xs mb-2">{fieldErrors.items}</p>
                                )}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#E4E7EC] bg-[#E5E5E5]">
                                                <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] w-[150px] border-r border-[#E4E7EC]">Item Detail</th>
                                                <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] w-[200px] border-r border-[#E4E7EC]">Description</th>
                                                <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Quantity</th>
                                                <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Rate</th>
                                                <th className="text-left py-3 px-4 text-[14px] font-normal text-[#667085] border-r border-[#E4E7EC]">Amount</th>
                                                <th className="w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) => (
                                                <tr key={item.id} className="border-b border-[#E4E7EC]">
                                                    <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                        <input
                                                            type="text"
                                                            value={item.itemName}
                                                            onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                                            className="w-full text-[14px] font-medium text-[#101828] focus:outline-none bg-transparent"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                        <input
                                                            type="text"
                                                            value={item.description || ""}
                                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                            className="w-full text-[14px] text-[#101828] focus:outline-none bg-transparent"
                                                            placeholder="Enter description"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className="w-full text-[14px] text-[#101828] focus:outline-none bg-transparent"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                        <input
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                            className="w-full text-[14px] text-[#101828] focus:outline-none bg-transparent"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4 border-r border-[#E4E7EC]">
                                                        <input
                                                            type="number"
                                                            value={item.amount}
                                                            onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                                                            className="w-full text-[14px] font-semibold text-[#101828] focus:outline-none bg-transparent"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <button
                                                            onClick={() => removeRow(item.id)}
                                                            className="text-[#F04438] hover:text-red-700"
                                                        >
                                                            <X size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <button
                                        onClick={addNewRow}
                                        className="flex flex-row items-center text-nowrap gap-2 px-2 md:px-4 py-2.5 text-[#2F80ED] border border-[#D0D5DD] rounded-lg hover:bg-[#F0F7FF] transition-colors text-[0.7rem] md:text-[14px] font-medium"
                                    >
                                        <Plus size={18} />
                                        Add New Row
                                    </button>

                                    {/* Select Products Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={handleProductsDropdownClick}
                                            className="flex text-nowrap items-center gap-2 px-4 py-2.5 text-[#344054] text-[0.7rem] md:text-[14px] font-medium"
                                        >
                                            Select products
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        {showProductsDropdown && (
                                            <div className="absolute z-10 right-0 mt-1 w-72 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                                {/* Loading State */}
                                                {isLoadingProducts && (
                                                    <div className="flex items-center justify-center py-4">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F80ED]"></div>
                                                        <span className="ml-2 text-sm text-[#667085]">Loading products...</span>
                                                    </div>
                                                )}

                                                {/* Empty State */}
                                                {!isLoadingProducts && products.length === 0 && (
                                                    <div className="px-4 py-3 text-sm text-[#667085] text-center">
                                                        No products found
                                                    </div>
                                                )}

                                                {/* Products List */}
                                                {!isLoadingProducts && products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => handleSelectProduct(product)}
                                                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-[#E4E7EC] last:border-b-0"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600">
                                                            {product.itemName?.charAt(0)?.toUpperCase() || 'P'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{product.itemName}</p>
                                                            <p className="text-sm text-gray-600">₦{product.rate?.toLocaleString() || 0}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-[#E4E7EC] p-4 space-y-6">
                                <div>
                                    <label className="block text-[16px] font-medium text-[#101828] mb-3">
                                        Customer Note
                                    </label>
                                    <textarea
                                        placeholder="Placeholder"
                                        rows={4}
                                        value={customerNote}
                                        onChange={(e) => setCustomerNote(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[16px] font-medium text-[#101828] mb-3">
                                        Terms & Conditions
                                    </label>
                                    <textarea
                                        placeholder="Placeholder"
                                        rows={4}
                                        value={termsAndConditions}
                                        onChange={(e) => setTermsAndConditions(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] resize-none"
                                    />
                                </div>
                                {/* Signature */}
                                <div className="flex items-center gap-4">
                                    <label className="text-[16px] font-medium text-[#101828]">
                                        Add Signature
                                    </label>
                                    <button
                                        onClick={() => setShowSignatureModal(true)}
                                        className="flex items-center justify-center w-10 h-10 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="hidden md:flex justify-between items-center">
                                <div className="flex gap-4">
                                    <Link href="/dashboard/invoices" className="px-8 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 text-[14px] font-medium">
                                        Cancel
                                    </Link>
                                    <button
                                        onClick={handleSaveDraft}
                                        disabled={isSavingDraft || !hasFormChanges()}
                                        className={`px-8 py-3 border border-[#D0D5DD] rounded-lg text-[14px] font-medium transition-colors ${isSavingDraft || !hasFormChanges()
                                            ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                            : 'text-[#344054] hover:bg-gray-50 cursor-pointer'
                                            }`}
                                    >
                                        {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                                    </button>
                                </div>
                                <button
                                    onClick={handlePreviewInvoice}
                                    className="flex items-center gap-2 px-8 py-3 rounded-lg text-[14px] font-medium transition-colors bg-[#2F80ED] text-white hover:bg-[#2563EB] cursor-pointer"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.7578 1.25C13.2987 1.25007 13.8276 1.36713 14.3105 1.58691C14.7155 1.77119 15.0885 2.02799 15.4092 2.34863L19.6514 6.59082C19.972 6.91146 20.2288 7.28452 20.4131 7.68945C20.6329 8.17244 20.7499 8.70127 20.75 9.24219V19C20.75 21.0711 19.0711 22.75 17 22.75H7C4.92893 22.75 3.25 21.0711 3.25 19V5C3.25 2.92893 4.92893 1.25 7 1.25H12.7578ZM7 2.75C5.75736 2.75 4.75 3.75736 4.75 5V19C4.75 20.2426 5.75736 21.25 7 21.25H17C18.2426 21.25 19.25 20.2426 19.25 19V9.24219C19.2499 8.9177 19.1797 8.60037 19.0479 8.31055C18.9987 8.20264 18.9398 8.09929 18.874 8H15C14.4477 8 14 7.55228 14 7V3.12598C13.9007 3.06015 13.7974 3.00126 13.6895 2.95215C13.3996 2.82026 13.0823 2.75007 12.7578 2.75H7ZM15.25 10.75C15.6642 10.75 16 11.0858 16 11.5V11.8662C16.5728 12.0136 17.0489 12.3242 17.3613 12.7217C17.6172 13.0473 17.5608 13.5194 17.2354 13.7754C16.9097 14.0313 16.4376 13.975 16.1816 13.6494C16.0477 13.479 15.732 13.2725 15.25 13.2725C14.4818 13.2725 14.25 13.7402 14.25 13.8867C14.2501 14.2045 14.3442 14.2907 14.4092 14.3359C14.5279 14.4186 14.78 14.5 15.25 14.5C15.83 14.5 16.4535 14.5891 16.9473 14.9326C17.4946 15.3135 17.7499 15.9094 17.75 16.6133C17.75 17.5939 16.9913 18.3658 16 18.6289V19C16 19.4142 15.6642 19.75 15.25 19.75C14.8358 19.75 14.5 19.4142 14.5 19V18.6328C13.9273 18.4854 13.4511 18.1757 13.1387 17.7783C12.8828 17.4527 12.9392 16.9806 13.2646 16.7246C13.5903 16.4687 14.0624 16.525 14.3184 16.8506C14.4523 17.021 14.768 17.2275 15.25 17.2275C16.0182 17.2275 16.25 16.7598 16.25 16.6133C16.2499 16.2955 16.1558 16.2093 16.0908 16.1641C15.9721 16.0814 15.72 16 15.25 16C14.67 16 14.0465 15.9109 13.5527 15.5674C13.0054 15.1865 12.7501 14.5906 12.75 13.8867C12.75 12.906 13.5086 12.1332 14.5 11.8701V11.5C14.5 11.0858 14.8358 10.75 15.25 10.75ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10C12.75 10.4142 12.4142 10.75 12 10.75H7C6.58579 10.75 6.25 10.4142 6.25 10C6.25 9.58579 6.58579 9.25 7 9.25H12ZM11 5.25C11.4142 5.25 11.75 5.58579 11.75 6C11.75 6.41421 11.4142 6.75 11 6.75H7C6.58579 6.75 6.25 6.41421 6.25 6C6.25 5.58579 6.58579 5.25 7 5.25H11Z" fill="white" />
                                    </svg>
                                    Preview Invoice
                                </button>
                            </div>
                        </div>

                        {showSignatureModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-[#101828]">Add Signature</h3>
                                        <button
                                            onClick={() => {
                                                setShowSignatureModal(false);
                                                clearCanvas();
                                            }}
                                            className="text-[#667085] hover:text-[#101828]"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <canvas
                                            ref={canvasRef}
                                            width={400}
                                            height={200}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            className="w-full border-2 border-[#D0D5DD] rounded-lg cursor-crosshair bg-white"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={clearCanvas}
                                            className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowSignatureModal(false);
                                                clearCanvas();
                                            }}
                                            className="flex-1 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={saveSignature}
                                            className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB]"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg w-full md:w-[320px] self-start">
                        <div className="space-y-6">
                            <div className=" rounded-lg   p-4">
                                <h3 className="font-medium text-[16px] mb-2">Language</h3>
                                <div className="relative mb-4">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                                            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 9.37797C0 13.6777 2.71375 17.343 6.52176 18.756V0C2.71375 1.41289 0 5.07836 0 9.37797Z" fill="#6DA544" />
                                                <path d="M20.0003 9.37797C20.0003 5.07836 17.2865 1.41289 13.4785 0V18.7561C17.2865 17.343 20.0003 13.6777 20.0003 9.37797Z" fill="#6DA544" />
                                            </svg>
                                        </div>
                                    </div>
                                    <select className="w-full pl-12 pr-3 py-2 border border-[#D0D5DD] rounded-lg appearance-none">
                                        <option>English</option>
                                        <option>Hausa</option>
                                        <option>Igbo</option>
                                        <option>Yoruba</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="font-medium text-[16px] mb-2">Currency <span className="text-red-500">*</span></h3>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg"
                                >
                                    <option value="NGN">NGN</option>
                                </select>
                            </div>

                            {/* Color Selection */}
                            <div className="bg-white rounded-lg px-4">
                                <h3 className="font-medium text-[16px] mb-2">Select Color</h3>
                                <ColorPicker
                                    initialColor={color}
                                    onColorChange={(newColor) => {
                                        setColor(newColor);
                                    }}
                                />
                            </div>
                            {/* Template Selection */}
                            <TemplateSelector
                                selectedTemplate={template}
                                onTemplateChange={setTemplate}
                            />

                            {/* Summary */}
                            <div className="bg-white rounded-lg  px-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <h3 className=" text-[16px] font-medium">Subtotal</h3>
                                        <span className=" text-[18px] font-semibold">₦{calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#667085] text-[18px]">Tax</span>
                                            <div className="relative inline-flex items-center">
                                                <select
                                                    value={invoiceTaxRate}
                                                    onChange={(e) => setInvoiceTaxRate(parseFloat(e.target.value))}
                                                    className="appearance-none bg-transparent text-[14px] text-[#667085] pr-6 focus:outline-none cursor-pointer"
                                                >
                                                    <option value="0">0%</option>
                                                    <option value="5">5%</option>
                                                    <option value="7.5">7.5%</option>
                                                    <option value="10">10%</option>
                                                    <option value="15">15%</option>
                                                    <option value="20">20%</option>
                                                </select>
                                                <svg className="absolute right-0 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <span className=" text-[18px] font-semibold">₦{calculateTax().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#667085] text-[18px]">WHT (5%)</span>
                                        <span className=" text-[18px] font-semibold">₦{calculateWht().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[18px] text-[#667085]">Total Due</span>
                                        <span className=" text-[18px] font-semibold">₦{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {showSignatureModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-[#101828]">Add Signature</h3>
                                            <button
                                                onClick={() => {
                                                    setShowSignatureModal(false);
                                                    clearCanvas();
                                                }}
                                                className="text-[#667085] hover:text-[#101828]"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <canvas
                                                ref={canvasRef}
                                                width={400}
                                                height={200}
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                                className="w-full border-2 border-[#D0D5DD] rounded-lg cursor-crosshair bg-white"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={clearCanvas}
                                                className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowSignatureModal(false);
                                                    clearCanvas();
                                                }}
                                                className="flex-1 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={saveSignature}
                                                className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB]"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg w-full md:w-[320px] self-start mt-2 md:mt-0">
                            <div className="space-y-6">
                                <div className="p-4">
                                    <h3 className="font-medium mb-2 text-lg sm:text-[16px]">Payment Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Bank Account <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Enter bank name or select"
                                                    value={paymentDetails.bankAccount}
                                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, bankAccount: e.target.value })}
                                                    className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED] ${fieldErrors.paymentBank ? 'border-red-500' : 'border-[#D0D5DD]'
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#344054]"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>

                                                {/* Bank Dropdown */}
                                                {showBankDropdown && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#D0D5DD] rounded-lg shadow-lg max-h-80 overflow-hidden">
                                                        {/* Search Bar */}
                                                        <div className="p-3 border-b border-[#E4E7EC] sticky top-0 bg-white">
                                                            <div className="relative">
                                                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M14 14L10 10M11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search bank..."
                                                                    value={bankSearchQuery}
                                                                    onChange={(e) => setBankSearchQuery(e.target.value)}
                                                                    className="w-full pl-9 pr-3 py-2 border border-[#D0D5DD] rounded-lg text-[14px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="max-h-60 overflow-y-auto">
                                                            {nigerianBanks.map((group) => {
                                                                const filteredBanks = group.banks.filter(bank =>
                                                                    bank.toLowerCase().includes(bankSearchQuery.toLowerCase())
                                                                );
                                                                if (filteredBanks.length === 0) return null;
                                                                return (
                                                                    <div key={group.category}>
                                                                        <div className="px-4 py-2 text-xs font-semibold text-[#667085] bg-gray-50 sticky top-0">
                                                                            {group.category}
                                                                        </div>
                                                                        {filteredBanks.map((bank) => (
                                                                            <div
                                                                                key={bank}
                                                                                onClick={() => {
                                                                                    setPaymentDetails({ ...paymentDetails, bankAccount: bank });
                                                                                    setShowBankDropdown(false);
                                                                                    setBankSearchQuery("");
                                                                                }}
                                                                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${paymentDetails.bankAccount === bank ? 'bg-[#2F80ED] text-white hover:bg-[#2F80ED]' : ''
                                                                                    }`}
                                                                            >
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${paymentDetails.bankAccount === bank ? 'bg-white text-[#2F80ED]' : 'bg-gray-100 text-gray-600'
                                                                                    }`}>
                                                                                    {bank.charAt(0)}
                                                                                </div>
                                                                                <span className={`font-medium ${paymentDetails.bankAccount === bank ? 'text-white' : 'text-gray-900'}`}>
                                                                                    {bank}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })}
                                                            {nigerianBanks.every(group =>
                                                                group.banks.filter(bank => bank.toLowerCase().includes(bankSearchQuery.toLowerCase())).length === 0
                                                            ) && (
                                                                    <div className="px-4 py-3 text-sm text-[#667085] text-center">
                                                                        No banks found
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {fieldErrors.paymentBank && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors.paymentBank}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Account Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter account name"
                                                value={paymentDetails.accountName}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, accountName: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg ${fieldErrors.paymentAccountName ? 'border-red-500' : 'border-[#D0D5DD]'
                                                    }`}
                                            />
                                            {fieldErrors.paymentAccountName && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors.paymentAccountName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#344054] mb-2">
                                                Account Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter account number"
                                                value={paymentDetails.accountNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-lg ${fieldErrors.paymentAccountNumber ? 'border-red-500' : 'border-[#D0D5DD]'
                                                    }`}
                                            />
                                            {fieldErrors.paymentAccountNumber && (
                                                <p className="text-red-500 text-xs mt-1">{fieldErrors.paymentAccountNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col md:hidden w-full pb-12 justify-center items-center bg-white pt-5 px-3 text-center">
                        <div className="flex flex-row gap-4 w-full mb-4">
                            <Link href="/dashboard/invoices" className="w-[50%] px-8 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 text-[14px] font-medium">
                                Cancel
                            </Link>
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSavingDraft || !hasFormChanges()}
                                className={`w-[50%] px-8 py-3 border border-[#D0D5DD] rounded-lg text-[14px] font-medium transition-colors ${isSavingDraft || !hasFormChanges()
                                    ? 'text-gray-400 bg-gray-50 cursor-not-allowed'
                                    : 'text-[#344054] hover:bg-gray-50 cursor-pointer'
                                    }`}
                            >
                                {isSavingDraft ? 'Saving...' : 'Save as Draft'}
                            </button>
                        </div>
                        <button
                            onClick={handlePreviewInvoice}
                            className="w-full flex justify-center items-center gap-2 px-8 py-3 rounded-lg text-[14px] font-medium transition-colors bg-[#2F80ED] text-white hover:bg-[#2563EB] cursor-pointer"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.7578 1.25C13.2987 1.25007 13.8276 1.36713 14.3105 1.58691C14.7155 1.77119 15.0885 2.02799 15.4092 2.34863L19.6514 6.59082C19.972 6.91146 20.2288 7.28452 20.4131 7.68945C20.6329 8.17244 20.7499 8.70127 20.75 9.24219V19C20.75 21.0711 19.0711 22.75 17 22.75H7C4.92893 22.75 3.25 21.0711 3.25 19V5C3.25 2.92893 4.92893 1.25 7 1.25H12.7578ZM7 2.75C5.75736 2.75 4.75 3.75736 4.75 5V19C4.75 20.2426 5.75736 21.25 7 21.25H17C18.2426 21.25 19.25 20.2426 19.25 19V9.24219C19.2499 8.9177 19.1797 8.60037 19.0479 8.31055C18.9987 8.20264 18.9398 8.09929 18.874 8H15C14.4477 8 14 7.55228 14 7V3.12598C13.9007 3.06015 13.7974 3.00126 13.6895 2.95215C13.3996 2.82026 13.0823 2.75007 12.7578 2.75H7ZM15.25 10.75C15.6642 10.75 16 11.0858 16 11.5V11.8662C16.5728 12.0136 17.0489 12.3242 17.3613 12.7217C17.6172 13.0473 17.5608 13.5194 17.2354 13.7754C16.9097 14.0313 16.4376 13.975 16.1816 13.6494C16.0477 13.479 15.732 13.2725 15.25 13.2725C14.4818 13.2725 14.25 13.7402 14.25 13.8867C14.2501 14.2045 14.3442 14.2907 14.4092 14.3359C14.5279 14.4186 14.78 14.5 15.25 14.5C15.83 14.5 16.4535 14.5891 16.9473 14.9326C17.4946 15.3135 17.7499 15.9094 17.75 16.6133C17.75 17.5939 16.9913 18.3658 16 18.6289V19C16 19.4142 15.6642 19.75 15.25 19.75C14.8358 19.75 14.5 19.4142 14.5 19V18.6328C13.9273 18.4854 13.4511 18.1757 13.1387 17.7783C12.8828 17.4527 12.9392 16.9806 13.2646 16.7246C13.5903 16.4687 14.0624 16.525 14.3184 16.8506C14.4523 17.021 14.768 17.2275 15.25 17.2275C16.0182 17.2275 16.25 16.7598 16.25 16.6133C16.2499 16.2955 16.1558 16.2093 16.0908 16.1641C15.9721 16.0814 15.72 16 15.25 16C14.67 16 14.0465 15.9109 13.5527 15.5674C13.0054 15.1865 12.7501 14.5906 12.75 13.8867C12.75 12.906 13.5086 12.1332 14.5 11.8701V11.5C14.5 11.0858 14.8358 10.75 15.25 10.75ZM12 9.25C12.4142 9.25 12.75 9.58579 12.75 10C12.75 10.4142 12.4142 10.75 12 10.75H7C6.58579 10.75 6.25 10.4142 6.25 10C6.25 9.58579 6.58579 9.25 7 9.25H12ZM11 5.25C11.4142 5.25 11.75 5.58579 11.75 6C11.75 6.41421 11.4142 6.75 11 6.75H7C6.58579 6.75 6.25 6.41421 6.25 6C6.25 5.58579 6.58579 5.25 7 5.25H11Z" fill="white" />
                            </svg>
                            Preview Invoice
                        </button>
                    </div>
                </div>

                {showAddClientModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-2xl p-5 w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-xl font-semibold text-[#101828]">Add New Client</h3>
                                <button
                                    onClick={() => setShowAddClientModal(false)}
                                    className="text-[#667085] hover:text-[#101828]"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-[13px] text-[#667085] mb-3">Save your client&apos;s business details to send invoices and track payments easily</p>

                            {clientFormError && (
                                <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-[13px] text-red-700">{clientFormError}</p>
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <div>
                                    <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                        Customer Type<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={newClientForm.customerType}
                                            onChange={(e) => setNewClientForm({ ...newClientForm, customerType: e.target.value })}
                                            className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] text-[#98A2B3] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                                            <option value="">Select customer type</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Business">Business</option>
                                            <option value="Corporate">Corporate</option>
                                            <option value="Government">Government</option>
                                            <option value="Non-Profit">Non-Profit</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                            Title<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={newClientForm.title}
                                                onChange={(e) => setNewClientForm({ ...newClientForm, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] text-[#98A2B3] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                                                <option value="Mr">Mr</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Dr">Dr</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 6L8 10L12 6" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                            Client Full Name<span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter client full name"
                                            value={newClientForm.fullName}
                                            onChange={(e) => setNewClientForm({ ...newClientForm, fullName: e.target.value })}
                                            className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                        Business Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter business name"
                                        value={newClientForm.businessName}
                                        onChange={(e) => setNewClientForm({ ...newClientForm, businessName: e.target.value })}
                                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                            Email Address<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                placeholder="Enter client email"
                                                value={newClientForm.email}
                                                onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-[#D0D5DD] rounded-lg text-[13px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]">
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#344054] mb-1">
                                            Phone Number<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                placeholder="Enter client phone number"
                                                value={newClientForm.phone}
                                                onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-[#D0D5DD] rounded-lg text-[13px] placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]">
                                                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1112 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.988 11.489 17.1118 9.32498 15.7083C7.31151 14.4289 5.60443 12.7218 4.32498 10.7083C2.91663 8.53438 2.04019 6.05916 1.76665 3.48334C1.74583 3.25292 1.77321 3.02069 1.84707 2.80139C1.92092 2.58209 2.03963 2.38061 2.19562 2.2098C2.35162 2.03899 2.54149 1.90258 2.75314 1.80943C2.9648 1.71627 3.19348 1.66847 3.42498 1.66834H5.92498C6.32953 1.66445 6.72148 1.80628 7.02812 2.06942C7.33476 2.33256 7.53505 2.69956 7.59165 3.10001C7.69717 3.90006 7.89286 4.68562 8.17498 5.44167C8.28712 5.74037 8.31137 6.06396 8.24491 6.37531C8.17844 6.68666 8.02404 6.97334 7.79998 7.20001L6.74165 8.25834C7.92795 10.3446 9.65536 12.072 11.7417 13.2583L12.8 12.2C13.0267 11.976 13.3133 11.8216 13.6247 11.7551C13.936 11.6886 14.2596 11.7129 14.5583 11.825C15.3144 12.1071 16.0999 12.3028 16.9 12.4083C17.3048 12.4654 17.6755 12.6693 17.9388 12.9812C18.2021 13.2931 18.3402 13.6913 18.3333 14.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CountryDropdown
                                    value={newClientForm.country}
                                    onChange={(value) => setNewClientForm({ ...newClientForm, country: value })}
                                    label="Country"
                                    placeholder="Select customer country"
                                />
                            </div>

                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={() => setShowAddClientModal(false)}
                                    className="flex-1 px-6 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-blue-50 transition-colors text-[14px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveNewClient}
                                    disabled={isSavingClient}
                                    className="flex-1 px-6 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-blue-600 transition-colors text-[14px] disabled:bg-blue-400"
                                >
                                    {isSavingClient ? 'Saving...' : 'Save Client'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddProductModal && (
                    <AddProductModal
                        product={null}
                        onClose={() => setShowAddProductModal(false)}
                        onSave={handleProductSave}
                    />
                )}
            </div>
        </>
    )
};
export default CreateInvoicePage;
