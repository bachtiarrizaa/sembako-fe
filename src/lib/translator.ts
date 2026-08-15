const messageMap: Record<string, string> = {
  // Auth messages
  "Login successful": "Login berhasil",
  "Logout successful": "Berhasil keluar dari akun",
  "Invalid credentials": "Email atau kata sandi tidak sesuai",
  "Invalid email or password": "Email atau kata sandi tidak sesuai",
  "User not found": "Pengguna tidak ditemukan",
  "Unauthorized": "Sesi telah berakhir, silakan login kembali",
  "Unauthorized access": "Sesi telah berakhir, silakan login kembali",
  "Token expired": "Sesi telah berakhir, silakan login kembali",
  "Failed to sign in. Please check your credentials.": "Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.",
  "Failed to log out on server. Proceeding to login.": "Gagal keluar dari server. Dialihkan ke halaman login.",

  // Role messages
  "Role created successfully": "Role berhasil ditambahkan",
  "Role updated successfully": "Role berhasil diperbarui",
  "Role deleted successfully": "Role berhasil dihapus",
  "Role name already exists": "Nama role sudah digunakan",
  "Role not found": "Role tidak ditemukan",
  "Cannot delete role assigned to users": "Role tidak dapat dihapus karena masih digunakan oleh pengguna",

  // Category messages
  "Category created successfully": "Kategori berhasil ditambahkan",
  "Category updated successfully": "Kategori berhasil diperbarui",
  "Category deleted successfully": "Kategori berhasil dihapus",
  "Category name already exists": "Nama kategori sudah digunakan",
  "Category not found": "Kategori tidak ditemukan",

  // Unit messages
  "Unit created successfully": "Satuan berhasil ditambahkan",
  "Unit updated successfully": "Satuan berhasil diperbarui",
  "Unit deleted successfully": "Satuan berhasil dihapus",
  "Unit name already exists": "Nama Satuan sudah digunakan",
  "Unit not found": "Satuan tidak ditemukan",

  // User messages
  "User created successfully": "Pegawai berhasil ditambahkan",
  "User updated successfully": "Pegawai berhasil diperbarui",
  "User deleted successfully": "Pegawai berhasil dihapus",
  "User status updated successfully": "Status pegawai berhasil diubah",
  "Email already exists": "Email sudah digunakan",
  "Username already exists": "Username sudah digunakan",
  "Cannot delete yourself": "Tidak dapat menghapus akun sendiri",
  "Cannot deactivate yourself": "Tidak dapat menonaktifkan akun sendiri",

  // Supplier messages
  "Supplier created successfully": "Supplier berhasil ditambahkan",
  "Supplier updated successfully": "Supplier berhasil diperbarui",
  "Supplier deleted successfully": "Supplier berhasil dihapus",
  "Supplier status updated successfully": "Status supplier berhasil diubah",
  "Supplier name already exists": "Nama supplier sudah digunakan",
  "Supplier not found": "Supplier tidak ditemukan",

  // Customer messages
  "Customer created successfully": "Customer berhasil ditambahkan",
  "Customer updated successfully": "Customer berhasil diperbarui",
  "Customer deleted successfully": "Customer berhasil dihapus",
  "Customer status updated successfully": "Status customer berhasil diubah",
  "Customer name already exists": "Nama customer sudah digunakan",
  "Customer not found": "Customer tidak ditemukan",

  // Discount messages
  "Discount created successfully": "Diskon berhasil ditambahkan",
  "Discount updated successfully": "Diskon berhasil diperbarui",
  "Discount deleted successfully": "Diskon berhasil dihapus",
  "Discount status updated successfully": "Status diskon berhasil diubah",
  "Discount name already exists": "Nama diskon sudah digunakan",
  "Discount not found": "Diskon tidak ditemukan",

  // Purchase messages
  "purchase recorded successfully": "Pembelian berhasil dicatat",
  "purchase batch updated successfully": "Pembelian berhasil diperbarui",
  "purchase batch deleted successfully": "Pembelian berhasil dihapus",
  "cannot update quantity or price of a purchase batch that has been partially sold": "Stok telah terjual sebagian, jumlah stok dan harga beli tidak dapat diubah",
  "cannot delete a purchase batch that has been partially sold": "Batch tidak dapat dihapus karena stok telah terjual sebagian",

  // Generic error messages
  "An unexpected error occurred": "Terjadi kesalahan yang tidak terduga",
  "Internal server error": "Terjadi kesalahan pada server",
  "Network Error": "Gagal terhubung ke server. Periksa koneksi internet Anda.",
}

export function translateMessage(message?: string | null, fallbackMessage = "Terjadi kesalahan"): string {
  if (!message) return fallbackMessage

  const trimmed = message.trim()

  // Exact match check
  if (messageMap[trimmed]) {
    return messageMap[trimmed]
  }

  // Case-insensitive match check
  const lower = trimmed.toLowerCase()
  for (const [key, val] of Object.entries(messageMap)) {
    if (key.toLowerCase() === lower) {
      return val
    }
  }

  return message
}
