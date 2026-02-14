# Example: Updating InvoiceList Component with Translations & Currency Formatting

## Original Code (Before)

```typescript
// src/components/invoices/InvoiceList.tsx
import React, { useState, useMemo } from 'react';
import { InvoiceResponse } from '@/types/invoice';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  loading,
  error,
  onDeleteInvoice,
}) => {
  // ... state management

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading invoices...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          All Invoices ({invoices.length})
        </h2>
        
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
        </select>
        
        <span className="text-sm text-gray-600">Sort by:</span>
        <button onClick={() => handleSort('creationDate')}>
          Date {getSortIcon('creationDate')}
        </button>
        <button onClick={() => handleSort('totalDue')}>
          Amount {getSortIcon('totalDue')}
        </button>
      </div>
    </div>
  );
};
```

## Updated Code (After)

```typescript
// src/components/invoices/InvoiceList.tsx
import React, { useState, useMemo } from 'react';
import { InvoiceResponse } from '@/types/invoice';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/currencyFormatter';

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  loading,
  error,
  onDeleteInvoice,
}) => {
  const { t } = useTranslation();
  
  // ... state management

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t('loading_invoices')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t('error_loading_invoices')}</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('all_invoices')} ({invoices.length})
        </h2>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('search_invoices')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm"
        >
          <option value="all">{t('all_status')}</option>
          {availableStatuses.map(status => (
            <option key={status} value={status}>
              {t(status.toLowerCase()) || status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t('sort_by')}:</span>
          <button
            onClick={() => handleSort('creationDate')}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
              sortField === 'creationDate' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('date')} {getSortIcon('creationDate')}
          </button>
          <button
            onClick={() => handleSort('totalDue')}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
              sortField === 'totalDue' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('amount')} {getSortIcon('totalDue')}
          </button>
          <button
            onClick={() => handleSort('status')}
            className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
              sortField === 'status' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('status')} {getSortIcon('status')}
          </button>
        </div>
      </div>

      <div className="p-6">
        {filteredAndSortedInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? t('no_invoices_match')
                : t('no_invoices_found')}
            </div>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {t('clear_filters')}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-4">
                <div className="font-semibold">{invoice.invoiceNumber}</div>
                <div className="text-sm text-gray-600">{invoice.billTo?.fullName}</div>
                <div className="text-lg font-bold mt-2">
                  {formatCurrency(invoice.totalDue)}
                </div>
                <div className="text-sm mt-1">
                  {t('due_date')}: {new Date(invoice.dueDate).toLocaleDateString()}
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {t(invoice.status?.toLowerCase() || 'draft')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
```

## Key Changes Made

### 1. Import Translation Hook
```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Initialize Translation
```typescript
const { t } = useTranslation();
```

### 3. Replace All Hardcoded Text
- `"Loading invoices..."` → `{t('loading_invoices')}`
- `"All Invoices"` → `{t('all_invoices')}`
- `"Search invoices..."` → `{t('search_invoices')}`
- `"All Status"` → `{t('all_status')}`
- `"Sort by:"` → `{t('sort_by')}:`
- `"Date"` → `{t('date')}`
- `"Amount"` → `{t('amount')}`
- `"Status"` → `{t('status')}`
- `"No invoices match your search criteria"` → `{t('no_invoices_match')}`
- `"Clear filters"` → `{t('clear_filters')}`

### 4. Import and Use Currency Formatter
```typescript
import { formatCurrency } from '@/lib/currencyFormatter';

// Usage
<div className="text-lg font-bold mt-2">
  {formatCurrency(invoice.totalDue)}
</div>
```

### 5. Translate Status Values
```typescript
<div className={`inline-block px-2 py-1 rounded text-xs mt-2`}>
  {t(invoice.status?.toLowerCase() || 'draft')}
</div>
```

## More Examples

### Example 1: Dashboard Stats Card

**Before:**
```typescript
<div className="bg-white p-6 rounded-lg">
  <h3 className="text-gray-600 text-sm">Total Invoiced</h3>
  <p className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</p>
</div>
```

**After:**
```typescript
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/currencyFormatter';

const { t } = useTranslation();

<div className="bg-white p-6 rounded-lg">
  <h3 className="text-gray-600 text-sm">{t('total_invoiced')}</h3>
  <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
</div>
```

### Example 2: Form Labels

**Before:**
```typescript
<label className="block text-sm font-medium text-gray-700">
  Client Name
</label>
<input
  type="text"
  placeholder="Enter client name"
  className="mt-1 block w-full rounded-md border-gray-300"
/>
```

**After:**
```typescript
const { t } = useTranslation();

<label className="block text-sm font-medium text-gray-700">
  {t('client_name')}
</label>
<input
  type="text"
  placeholder={t('enter_client_name')}
  className="mt-1 block w-full rounded-md border-gray-300"
/>
```

### Example 3: Button Text

**Before:**
```typescript
<button className="bg-blue-600 text-white px-4 py-2 rounded">
  Create Invoice
</button>
<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
  Cancel
</button>
```

**After:**
```typescript
const { t } = useTranslation();

<button className="bg-blue-600 text-white px-4 py-2 rounded">
  {t('create_invoice')}
</button>
<button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
  {t('cancel')}
</button>
```

### Example 4: Table Headers

**Before:**
```typescript
<thead>
  <tr>
    <th>Invoice ID</th>
    <th>Client Name</th>
    <th>Amount</th>
    <th>Due Date</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
```

**After:**
```typescript
const { t } = useTranslation();

<thead>
  <tr>
    <th>{t('invoice_id')}</th>
    <th>{t('client_name')}</th>
    <th>{t('amount')}</th>
    <th>{t('due_date')}</th>
    <th>{t('status')}</th>
    <th>{t('actions')}</th>
  </tr>
</thead>
```

### Example 5: Currency in Tables

**Before:**
```typescript
<td className="px-4 py-2">
  ₦{invoice.amount.toLocaleString()}
</td>
<td className="px-4 py-2">
  ₦{invoice.balanceDue.toLocaleString()}
</td>
```

**After:**
```typescript
import { formatCurrency } from '@/lib/currencyFormatter';

<td className="px-4 py-2">
  {formatCurrency(invoice.amount)}
</td>
<td className="px-4 py-2">
  {formatCurrency(invoice.balanceDue)}
</td>
```

### Example 6: Chart Axis Labels

**Before:**
```typescript
<YAxis
  tickFormatter={(value) => `₦${value / 1000}k`}
/>
```

**After:**
```typescript
import { formatChartPrice } from '@/lib/currencyFormatter';

<YAxis
  tickFormatter={(value) => formatChartPrice(value)}
/>
```

### Example 7: Toast Messages

**Before:**
```typescript
showSuccess("Invoice created successfully!");
showError("Failed to create invoice. Please try again.");
```

**After:**
```typescript
const { t } = useTranslation();

showSuccess(t('invoice_created_successfully'));
showError(t('failed_create_invoice'));
```

### Example 8: Modal Content

**Before:**
```typescript
<div className="modal">
  <h2>Delete Invoice</h2>
  <p>Are you sure you want to delete this invoice?</p>
  <p>This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

**After:**
```typescript
const { t } = useTranslation();

<div className="modal">
  <h2>{t('delete_invoice')}</h2>
  <p>{t('delete_invoice_confirm')}</p>
  <p>{t('invoice_action_cannot_undone')}</p>
  <button>{t('cancel')}</button>
  <button>{t('delete')}</button>
</div>
```

## Testing Your Changes

After making these updates, test by:

1. **Switch languages** in the settings
2. **Verify all text changes** to the selected language
3. **Check currency formatting** is consistent
4. **Test with different amounts** (small, large, decimals)
5. **Verify placeholders** are translated
6. **Check button labels** are translated
7. **Test error messages** appear in correct language

## Common Pitfalls to Avoid

1. ❌ **Don't forget placeholders**
   ```typescript
   // Wrong
   <input placeholder="Search..." />
   
   // Correct
   <input placeholder={t('search')} />
   ```

2. ❌ **Don't hardcode currency symbols**
   ```typescript
   // Wrong
   <span>₦{amount}</span>
   
   // Correct
   <span>{formatCurrency(amount)}</span>
   ```

3. ❌ **Don't forget to import**
   ```typescript
   // Always import at the top
   import { useTranslation } from 'react-i18next';
   import { formatCurrency } from '@/lib/currencyFormatter';
   ```

4. ❌ **Don't use translation keys that don't exist**
   ```typescript
   // Check i18ns.ts first to ensure the key exists
   {t('some_key_that_doesnt_exist')} // Will show the key itself
   ```

5. ❌ **Don't format currency multiple times**
   ```typescript
   // Wrong
   <span>₦{formatCurrency(amount)}</span>
   
   // Correct (formatCurrency already adds the symbol)
   <span>{formatCurrency(amount)}</span>
   ```

## Quick Reference

### Common Translation Keys
- Navigation: `home`, `dashboard`, `invoices`, `clients`, `products`, `reports`
- Actions: `create`, `edit`, `delete`, `save`, `cancel`, `continue`, `back`
- Status: `paid`, `pending`, `overdue`, `draft`
- Messages: `loading`, `error`, `success`, `saving`

### Currency Formatting Functions
- `formatCurrency(amount)` - Full formatting with symbol
- `formatCurrencyCompact(amount)` - Compact (1.2k, 1.5M)
- `formatInvoicePrice(amount)` - Always 2 decimals
- `formatChartPrice(amount)` - For chart axes

## Next Steps

1. Update one component at a time
2. Test thoroughly after each update
3. Commit changes frequently
4. Document any new translation keys needed
5. Update this guide with new patterns you discover
