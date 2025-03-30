import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, TruckIcon, InfoIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { SearchFilters } from "@/components/cargo-posts/search-filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CargoPost {
  _id: string;
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  loadingDate: string;
  unloadingDate: string;
  vehicleType: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  createdBy: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  weight?: number;
  volume?: number;
  price?: number;
}

async function getCargoPostsData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/cargo-posts`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch cargo posts');
    }

    return res.json() as Promise<CargoPost[]>;
  } catch (error) {
    console.error('Error fetching cargo posts:', error);
    return [] as CargoPost[];
  }
}

export default async function CargoPostsPage() {
  const posts = await getCargoPostsData();

  if (!posts || posts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Yük İlanları</h1>
          <Button asChild>
            <Link href="/cargo-posts/new">Yeni İlan Ekle</Link>
          </Button>
        </div>
        <SearchFilters />
        <div className="text-center text-muted-foreground">
          Henüz ilan bulunmamaktadır.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Yük İlanları</h1>
        <Button asChild>
          <Link href="/cargo-posts/new">Yeni İlan Ekle</Link>
        </Button>
      </div>

      <SearchFilters />

      <div className="rounded-md border mt-6">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Güzergah</TableHead>
                <TableHead>Adresler</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Araç</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium">
                    {post.loadingCity} - {post.unloadingCity}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-green-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="text-xs">Y</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Yükleme: {post.loadingAddress}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-1 text-red-600">
                            <MapPinIcon className="w-4 h-4" />
                            <span className="text-xs">B</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Boşaltma: {post.unloadingAddress}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Yükleme: {new Date(post.loadingDate).toLocaleDateString("tr-TR")}</p>
                        <p>Boşaltma: {new Date(post.unloadingDate).toLocaleDateString("tr-TR")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <TruckIcon className="w-4 h-4 text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{post.vehicleType}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.status === "active" ? "success" : "destructive"}
                      className="w-2 h-2 rounded-full p-0"
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/cargo-posts/${post._id}`}>
                            <InfoIcon className="w-4 h-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detayları Gör</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/messages/${post.createdBy._id}`}>
                            <PhoneIcon className="w-4 h-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>İletişime Geç</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
} 