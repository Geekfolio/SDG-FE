import Layout from "@/components/ui/layout";
import EventManagement from "@/components/events/EventManagement";
import React from "react";
import { ToastContainer } from "react-toastify";

export default function Events() {
  return (
    <Layout>
      <EventManagement />
      <ToastContainer />
    </Layout>
  );
}
