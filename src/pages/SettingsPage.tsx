import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTvNavigation } from '@/hooks/use-tv-navigation';
import { useSettingsStore } from '@/store/settings';
import { Toaster, toast } from 'sonner';
const settingsSchema = z.object({
  serverUrl: z.string().url({ message: 'Please enter a valid URL.' }).min(1, { message: 'Server URL is required.' }),
  apiKey: z.string().min(1, { message: 'API Key is required.' }),
});
export function SettingsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useTvNavigation(pageRef);
  const navigate = useNavigate();
  const { serverUrl, apiKey, setSettings } = useSettingsStore();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      serverUrl: serverUrl || '',
      apiKey: apiKey || '',
    },
  });
  function onSubmit(values: z.infer<typeof settingsSchema>) {
    // Remove trailing slash if present
    const formattedUrl = values.serverUrl.endsWith('/') ? values.serverUrl.slice(0, -1) : values.serverUrl;
    setSettings(formattedUrl, values.apiKey);
    toast.success('Settings saved successfully!', {
      description: 'Redirecting to login...',
    });
    setTimeout(() => navigate('/login'), 1500);
  }
  return (
    <div ref={pageRef} className="p-6 md:p-8 text-white flex items-center justify-center min-h-screen">
      <Toaster richColors theme="dark" />
      <div className="max-w-2xl w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center">Settings</h1>
        <p className="text-center text-gray-400">
          Configure your Jellyfin server to start streaming.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="serverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Jellyfin Server URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://jellyfin.example.com"
                      {...field}
                      className="p-4 text-lg bg-gray-700 border-gray-600 focus:ring-blue-500 tv-focusable"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your API Key"
                      {...field}
                      className="p-4 text-lg bg-gray-700 border-gray-600 focus:ring-blue-500 tv-focusable"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg p-6 tv-focusable">
              Save Settings
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}