/**
 * Normalize nomor WhatsApp ke format +62xxxxxxxxx
 * Support format: 628..., 08..., +628...
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';

  // Hapus karakter selain angka dan +
  let normalized = phone.replace(/\D/g, '');

  // Jika mulai dengan 0, ganti dengan 62
  if (normalized.startsWith('0')) {
    normalized = '62' + normalized.slice(1);
  }

  // Jika belum ada 62 di depan, tambahkan
  if (!normalized.startsWith('62')) {
    normalized = '62' + normalized;
  }

  return '+' + normalized;
}

/**
 * Format nomor untuk display saja (tidak mengubah data)
 */
export function formatPhoneNumberDisplay(phone: string): string {
  const normalized = normalizePhoneNumber(phone);
  // Contoh: +62 82 2813 34100
  return normalized.replace(/(\d{3})/, '$1 ').replace(/(\d{2})(\d{4})(\d{5})/, '$1 $2 $3');
}
