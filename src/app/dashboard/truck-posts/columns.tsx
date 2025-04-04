"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export type TruckPost = {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: string;
  availableDate: string;
  status: "active" | "completed" | "cancelled";
  userId: string;
};

// Create a proper React component for the cell
const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const post = row.original;
      if (!post || !post._id) {
        return;
      }
      const response = await fetch(`/api/truck-posts/${post._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "İlan silinirken bir hata oluştu");
      }

      toast.success("İlan başarıyla silindi");
      router.refresh();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "İlan silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menüyü aç</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/truck-posts/${row.original._id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Düzenle
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Siliniyor..." : "Sil"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<TruckPost>[] = [
  {
    accessorKey: "title",
    header: "Başlık",
  },
  {
    accessorKey: "currentLocation",
    header: "Mevcut Konum",
  },
  {
    accessorKey: "destination",
    header: "Hedef Konum",
  },
  {
    accessorKey: "truckType",
    header: "Araç Tipi",
  },
  {
    accessorKey: "capacity",
    header: "Kapasite",
  },
  {
    accessorKey: "availableDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Müsait Tarih
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      try {
        const value = row.getValue("availableDate");
        if (typeof value !== "string" || !value) return "-";
        return formatDate(value);
      } catch (error) {
        return "-";
      }
    },
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      try {
        const value = row.getValue("status");
        if (!value) return null;
        
        const status = value.toString() as TruckPost["status"];
        return (
          <div className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status === "active"
                ? "Aktif"
                : status === "completed"
                ? "Tamamlandı"
                : "İptal Edildi"}
            </span>
          </div>
        );
      } catch (error) {
        return null;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />
  },
]; 