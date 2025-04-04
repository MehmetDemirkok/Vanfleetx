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
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type VehiclePost = {
  _id: string;
  title: string;
  currentLocation: string;
  destination: string;
  vehicleType: string;
  capacity: string;
  availableDate: string;
  status: "active" | "completed" | "cancelled";
};

async function deleteVehiclePost(id: string) {
  try {
    const response = await fetch(`/api/vehicle-posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("İlan silinirken bir hata oluştu");
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

// Create a proper React component for the cell
const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteVehiclePost(row.original._id);
      toast.success("İlan başarıyla silindi");
      router.refresh();
    } catch (error) {
      toast.error("İlan silinirken bir hata oluştu");
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
          onClick={() => router.push(`/vehicle-posts/${row.original._id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<VehiclePost>[] = [
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
    header: "Varış Noktası",
  },
  {
    accessorKey: "vehicleType",
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
    cell: ({ row }) => formatDate(row.getValue("availableDate")),
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />
  },
]; 