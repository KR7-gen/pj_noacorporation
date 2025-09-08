"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getVehicles, deleteVehicle, updateVehicle, testFirebaseConnection } from "@/lib/firebase-utils"
import type { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import AdminVehiclesPage from "./vehicles/page"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { formatNumberWithCommas, formatInputWithCommas } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPage() {
  return <AdminVehiclesPage />
}