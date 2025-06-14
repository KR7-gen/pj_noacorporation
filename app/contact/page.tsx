"use client"

import { useSearchParams } from "next/navigation"
import ContactForm from "../components/ContactForm"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const inquiryNumber = searchParams.get("inquiryNumber")
  const inquiryType = searchParams.get("inquiryType")
  const maker = searchParams.get("maker")
  const model = searchParams.get("model")
  const year = searchParams.get("year")
  const mileage = searchParams.get("mileage")
  const name = searchParams.get("name")
  const phone = searchParams.get("phone")
  const email = searchParams.get("email")

  const initialData = {
    inquiryNumber: inquiryNumber || undefined,
    inquiryType: inquiryType || undefined,
    maker: maker || undefined,
    model: model || undefined,
    year: year || undefined,
    mileage: mileage || undefined,
    name: name || undefined,
    phone: phone || undefined,
    email: email || undefined
  }

  return <ContactForm {...initialData} />
} 