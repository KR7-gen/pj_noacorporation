"use client";

import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import type { Vehicle } from "@/types";
import { Trash2 } from "lucide-react";
import Image from "next/image";

// 車検状態の選択肢
const inspectionStatuses = [
  "車検付き",
  "予備検査",
  "車検切れ",
  "車検なし"
];

const vehicleSchema = z.object({
  name: z.string().min(1, "トラック名は必須です"),
  price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("車両価格は必須です")
  ),
  totalPrice: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive("車両価格（税込）は必須です")
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
  mileageStatus: z.string().optional(),
  bodyType: z.string().optional(),
  size: z.string().optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.object({ id: z.string(), url: z.string() })).default([]),
  inspectionStatus: z.string().optional(),
  inspectionDate: z.string().optional(),
}).refine((data) => {
  // 車検付きまたは予備検査の場合、車検有効期限は必須
  if (data.inspectionStatus === "車検付き" || data.inspectionStatus === "予備検査") {
    return data.inspectionDate && data.inspectionDate.trim() !== "";
  }
  return true;
}, {
  message: "車検付きまたは予備検査の場合は車検有効期限は必須です",
  path: ["inspectionDate"]
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

// プルダウンの選択肢
const bodyTypes = [
  "クレーン", "ダンプ", "平ボディ", "車輌運搬車", "ミキサー車",
  "高所作業車", "アルミバン", "アルミウィング", "キャリアカー",
  "塵芥車", "アームロール", "バス", "冷蔵冷凍車", "タンクローリー", "特装車・その他"
];
const makers = [
  "日野",
  "いすゞ",
  "三菱ふそう",
  "UD",
  "トヨタ",
  "日産",
  "マツダ",
  "ホンダ",
  "スバル",
  "スズキ",
  "ダイハツ",
  "ベンツ",
  "ボルボ",
  "スカニア",
  "東急",
  "東邦車輌",
  "花見台",
  "トレクス",
  "トレモ",
  "フルハーフ",
  "ユソーキ",
  "ダイニチ",
  "アンチコ",
  "その他"
];
const sizes = ["大型", "増トン", "中型", "小型"];
const mileageStatuses = ["実走行", "メーター改ざん", "メーター交換", "不明"];

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
      name: initialData?.name || "",
      price: initialData?.price?.toString() || "",
      totalPrice: initialData?.totalPrice?.toString() || "",
      managementNumber: initialData?.managementNumber || "",
      maker: initialData?.maker || "",
      model: initialData?.model || "",
      year: initialData?.year?.toString() || "",
      mileage: initialData?.mileage?.toString() || "",
      mileageStatus: initialData?.mileageStatus || "実走行",
      bodyType: initialData?.bodyType || "",
      size: initialData?.size || "",
      description: initialData?.description || "",
      imageUrls: initialData?.imageUrls?.map((url, index) => ({ id: index.toString(), url })) || [],
      inspectionStatus: initialData?.inspectionStatus || "",
      inspectionDate: initialData?.inspectionDate || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "imageUrls",
  });

  // 車検状態を監視
  const inspectionStatus = useWatch({
    control,
    name: "inspectionStatus"
  });

  const handleFormSubmit = async (data: VehicleFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* 基本情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">トラック名 *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="日野 レンジャー"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="managementNumber">管理番号</Label>
          <Input
            id="managementNumber"
            {...register("managementNumber")}
            placeholder="管理番号を入力"
          />
        </div>

        <div>
          <Label htmlFor="maker">メーカー *</Label>
          <Controller
            name="maker"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="メーカーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {makers.map((maker) => (
                    <SelectItem key={maker} value={maker}>
                      {maker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.maker && (
            <p className="text-red-500 text-sm mt-1">{errors.maker.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="model">型式</Label>
          <Input
            id="model"
            {...register("model")}
            placeholder="型式を入力"
          />
        </div>

        <div>
          <Label htmlFor="year">年式</Label>
          <Input
            id="year"
            type="number"
            {...register("year")}
            placeholder="2020"
          />
        </div>

        <div>
          <Label htmlFor="mileage">走行距離</Label>
          <Input
            id="mileage"
            type="number"
            {...register("mileage")}
            placeholder="100000"
          />
        </div>
        <div>
          <Label htmlFor="mileageStatus">実走行かどうか</Label>
          <Controller
            name="mileageStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value || "実走行"}>
                <SelectTrigger>
                  <SelectValue placeholder="実走行かどうかを選択" />
                </SelectTrigger>
                <SelectContent>
                  {mileageStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="bodyType">ボディタイプ</Label>
          <Controller
            name="bodyType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="ボディタイプを選択" />
                </SelectTrigger>
                <SelectContent>
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="size">サイズ</Label>
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="サイズを選択" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="price">車両価格（税抜） *</Label>
          <Input
            id="price"
            type="number"
            {...register("price")}
            placeholder="5000000"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
                          <Label htmlFor="totalPrice">車両価格（税込） *</Label>
          <Input
            id="totalPrice"
            type="number"
            {...register("totalPrice")}
            placeholder="5500000"
          />
          {errors.totalPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.totalPrice.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="inspectionStatus">車検状態</Label>
          <Controller
            name="inspectionStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="車検状態を選択" />
                </SelectTrigger>
                <SelectContent>
                  {inspectionStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label htmlFor="inspectionDate">
            車検有効期限
            {(inspectionStatus === "車検付き" || inspectionStatus === "予備検査") && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <Input
            id="inspectionDate"
            {...register("inspectionDate")}
            placeholder="2025年12月"
          />
          {errors.inspectionDate && (
            <p className="text-red-500 text-sm mt-1">{errors.inspectionDate.message}</p>
          )}
        </div>
      </div>

      {/* 車両説明 */}
      <div>
        <Label htmlFor="description">車両説明</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="車両の詳細な説明を入力してください..."
          rows={4}
        />
      </div>

      {/* 画像アップロード */}
      <div>
        <Label>車両画像</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {fields.map((field, index) => (
            <div key={field.id} className="relative">
              <Image
                src={field.url}
                alt={`車両画像 ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
} 