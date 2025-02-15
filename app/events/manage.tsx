import Layout from '@/components/ui/layout'
import React from 'react'

export default function ManageEvents() {
  return (
    <Layout>
      <div className="space-y-4">
        {/* Create Event Card */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            Create Event
          </h1>
          {/* ...existing form code... */}
          <form>
            {/* Add form fields for event creation */}
          </form>
        </div>
        {/* Manage Events Card */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            Manage Events
          </h1>
          {/* ...existing management code... */}
          <div>
            {/* Add event management table/list */}
          </div>
        </div>
      </div>
    </Layout>
  )
}
