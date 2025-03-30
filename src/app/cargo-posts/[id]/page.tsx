import { notFound } from "next/navigation";
import { getCargoPostById } from "@/lib/actions/cargo-post.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, MapPinIcon, TruckIcon, UserIcon, ScaleIcon, BoxIcon, BanknoteIcon } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CargoPostPage({ params }: PageProps) {
  const post = await getCargoPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {post.loadingCity} - {post.unloadingCity}
            </CardTitle>
            <Badge variant={post.status === "active" ? "success" : "destructive"}>
              {post.status === "active" ? "Aktif" : "Pasif"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>Yükleme Yeri</span>
              </div>
              <p className="font-medium">{post.loadingAddress}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>Boşaltma Yeri</span>
              </div>
              <p className="font-medium">{post.unloadingAddress}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Yükleme Tarihi</span>
              </div>
              <p className="font-medium">
                {new Date(post.loadingDate).toLocaleDateString("tr-TR")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                <span>Boşaltma Tarihi</span>
              </div>
              <p className="font-medium">
                {new Date(post.unloadingDate).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TruckIcon className="w-4 h-4" />
                <span>Araç Tipi</span>
              </div>
              <p className="font-medium">{post.vehicleType}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span>İlan Sahibi</span>
              </div>
              <p className="font-medium">{post.createdBy?.name || 'Belirtilmemiş'}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            {post.weight && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ScaleIcon className="w-4 h-4" />
                  <span>Ağırlık</span>
                </div>
                <p className="font-medium">{post.weight} kg</p>
              </div>
            )}

            {post.volume && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BoxIcon className="w-4 h-4" />
                  <span>Hacim</span>
                </div>
                <p className="font-medium">{post.volume} m³</p>
              </div>
            )}

            {post.price && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BanknoteIcon className="w-4 h-4" />
                  <span>Fiyat</span>
                </div>
                <p className="font-medium">{post.price.toLocaleString('tr-TR')} ₺</p>
              </div>
            )}
          </div>

          {post.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Açıklama</h3>
                <p className="text-muted-foreground">{post.description}</p>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/cargo-posts">Geri Dön</Link>
          </Button>
          <Button>İletişime Geç</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 