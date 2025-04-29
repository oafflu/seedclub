import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function StripeSettings() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Stripe Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure your Stripe API keys and webhook settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Publishable Key</label>
              <Input type="text" placeholder="pk_..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Secret Key</label>
              <Input type="password" placeholder="sk_..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Webhook Secret</label>
              <Input type="password" placeholder="whsec_..." />
            </div>
            <Button>Save API Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure accepted payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credit Cards</p>
                <p className="text-sm text-gray-500">Accept credit card payments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">ACH Direct Debit</p>
                <p className="text-sm text-gray-500">Accept bank transfers (US only)</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SEPA Direct Debit</p>
                <p className="text-sm text-gray-500">Accept bank transfers (EU only)</p>
              </div>
              <Switch />
            </div>
            <Button>Save Payment Methods</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Manage webhook endpoints and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-mono break-all">
                  {`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/stripe`}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Use this URL in your Stripe Dashboard webhook settings
                </p>
              </div>
              <Button variant="outline">Test Webhook</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 