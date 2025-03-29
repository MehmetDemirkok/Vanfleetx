# Lojistik Platform

Modern ve kapsamlı bir lojistik platformu. Yük ve kamyon ilanlarını kolayca yönetin, iş ortaklarınızla hızlıca iletişime geçin.

## Özellikler

- Yük ilanları oluşturma ve yönetme
- Kamyon ilanları oluşturma ve yönetme
- Kullanıcı kimlik doğrulama ve yetkilendirme
- Responsive tasarım
- Modern ve kullanıcı dostu arayüz

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- MongoDB
- NextAuth.js

## Başlangıç

### Gereksinimler

- Node.js 18 veya üzeri
- MongoDB
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/yourusername/logistics-platform.git
   cd logistics-platform
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. `.env.local` dosyasını oluşturun ve gerekli ortam değişkenlerini ayarlayın:
   ```
   MONGODB_URI=mongodb://localhost:27017/logistics
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına bakın. 