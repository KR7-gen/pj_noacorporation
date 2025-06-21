"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Vehicle } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";

const vehicleSchema = z.object({
  name: z.string().min(1, "トラック名は必須です"),
  price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("車両価格は必須です")
  ),
  totalPrice: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("支払総額は必須です")
  ),
  managementNumber: z.string().optional(),
  maker: z.string().min(1, "メーカーは必須です"),
  model: z.string().optional(),
  year: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().optional()
  ),
  mileage: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().optional()
  ),
  bodyType: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string()).default([]),
  inspectionDate: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

// プルダウンの選択肢
const bodyTypes = [
  "クレーン", "ダンプ", "平ボディ", "車輌運搬車", "ミキサー車",
  "高所作業車", "アルミバン", "アルミウィング", "キャリアカー",
  "塵芥車", "アームロール", "バス", "冷蔵冷凍車", "タンクローリー", "特装車・その他"
];
const makers = ["日野", "いすゞ", "三菱ふそう", "UD", "その他"];
const sizes = ["大型", "増トン", "中型", "小型"];

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function VehicleForm({
  initialData,
  onSubmit,
  isSubmitting,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      ...initialData,
      price: initialData?.price?.toString() || "",
      totalPrice: initialData?.totalPrice?.toString() || "",
      year: initialData?.year?.toString() || "",
      mileage: initialData?.mileage?.toString() || "",
      imageUrls: initialData?.imageUrls || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imageUrls",
  });

  const handleFormSubmit = async (data: VehicleFormData) => {
    // フォームのデータを `Vehicle` 型に合わせる
    const vehicleData: Partial<Vehicle> = {
      ...data,
      // 必要に応じて型変換を行う
      price: Number(data.price),
      totalPrice: Number(data.totalPrice),
      year: data.year ? Number(data.year) : undefined,
      mileage: data.mileage ? Number(data.mileage) : undefined,
    };
    await onSubmit(vehicleData as VehicleFormData);
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="name">トラック名</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">車両価格（税抜）</Label>
          <Input id="price" type="number" {...register("price")} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="totalPrice">支払総額（税抜）</Label>
          <Input id="totalPrice" type="number" {...register("totalPrice")} />
          {errors.totalPrice && <p className="text-red-500 text-sm">{errors.totalPrice.message}</p>}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">画像登録</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative aspect-square">
              <Image
                src={field.value}
                alt={`Vehicle image ${index + 1}`}
                layout="fill"
                className="object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
            <Button
              type="button"
              onClick={() => {
                const url = prompt("画像のURLを入力してください");
                if (url) append(url);
              }}
            >
              画像を追加
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">車両情報</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Controller
            name="bodyType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="ボディタイプ" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="maker"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="メーカー" />
                </SelectTrigger>
                <SelectContent>
                  {makers.map((maker) => (
                    <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="大きさ" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div>
            <Label htmlFor="model">型式</Label>
            <Input id="model" {...register("model")} />
          </div>
          <div>
            <Label htmlFor="year">年式</Label>
            <Input id="year" type="number" {...register("year")} />
          </div>
          <div>
            <Label htmlFor="mileage">走行距離 (km)</Label>
            <Input id="mileage" type="number" {...register("mileage")} />
          </div>
          <div>
            <Label htmlFor="managementNumber">管理番号</Label>
            <Input id="managementNumber" {...register("managementNumber")} />
          </div>
          <div>
            <Label htmlFor="inspectionDate">車検有効期限</Label>
            <Input id="inspectionDate" type="date" {...register("inspectionDate")} />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="description">詳細説明</Label>
        <Textarea id="description" {...register("description")} rows={5} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "車両情報を保存"}
        </Button>
      </div>
    </form>
  );
} 