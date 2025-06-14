"use client"

import { useSearchParams } from "next/navigation"
import ContactForm from "../components/ContactForm"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const inquiryNumber = searchParams.get("inquiryNumber")

  return <ContactForm inquiryNumber={inquiryNumber || undefined} />
} 