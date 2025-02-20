'use client'
import React, { useState } from "react";
import Layout from "@/components/ui/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

export default function WorkshopPage() {
  const [showPayment, setShowPayment] = useState(false);

  const handlePayClick = () => {
    setShowPayment(true);
  };

  const handleClose = () => {
    setShowPayment(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 md:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Workshop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Join our interactive workshop where you'll learn new skills through hands-on exercises, group activities, and Q&amp;A sessions led by experienced professionals.
            </p>
            <p className="mt-4">
              <strong>Date:</strong> February 25, 2025
            </p>
            <p className="mt-2">
              <strong>Time:</strong> 10:00 AM - 4:00 PM
            </p>
            <p className="mt-2">
              <strong>Location:</strong> Online (via Zoom)
            </p>
            <Button variant="default" className="mt-4" onClick={handlePayClick}>
              Pay
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="h-[80vh] w-full max-w-3xl mx-auto">
            <DialogHeader>
              <DialogTitle>Workshop Payment</DialogTitle>
              <DialogClose onClick={handleClose} />
            </DialogHeader>
            <iframe
              src="https://razorpay.com/payment-link/plink_PxslJbz6tl13kQ"
              title="Workshop Payment"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}