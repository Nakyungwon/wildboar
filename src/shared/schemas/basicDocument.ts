import type { FormSchema } from '../types/form'

export const basicDocumentSchema: FormSchema = {
  id: 'basic-document',
  name: 'Basic Document',
  description: 'Generate a basic document with standard information fields',
  fields: [
    {
      id: 'title',
      type: 'text',
      label: 'Document Title',
      placeholder: 'Enter document title',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 100
      }
    },
    {
      id: 'author',
      type: 'text',
      label: 'Author Name',
      placeholder: 'Enter author name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      id: 'date',
      type: 'date',
      label: 'Document Date',
      placeholder: 'Select date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0]
    },
    {
      id: 'category',
      type: 'select',
      label: 'Category',
      placeholder: 'Select a category',
      required: true,
      options: [
        { label: 'Report', value: 'report' },
        { label: 'Letter', value: 'letter' },
        { label: 'Memo', value: 'memo' },
        { label: 'Proposal', value: 'proposal' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      id: 'content',
      type: 'textarea',
      label: 'Document Content',
      placeholder: 'Enter the main content of your document',
      required: true,
      validation: {
        minLength: 10,
        maxLength: 5000
      }
    }
  ],
  hwpxMapping: {
    title: '{{title}}',
    author: '{{author}}',
    date: '{{date}}',
    category: '{{category}}',
    content: '{{content}}'
  },
  xlsxMapping: {
    title: { sheet: 'Sheet1', cell: 'A1' },
    author: { sheet: 'Sheet1', cell: 'B1' },
    date: { sheet: 'Sheet1', cell: 'C1' },
    category: { sheet: 'Sheet1', cell: 'D1' },
    content: { sheet: 'Sheet1', cell: 'A2' }
  }
}
