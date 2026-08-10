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

<<<<<<< Updated upstream
=======
  // Category messages
  "Category created successfully": "Kategori berhasil ditambahkan",
  "Category updated successfully": "Kategori berhasil diperbarui",
  "Category deleted successfully": "Kategori berhasil dihapus",
  "Category name already exists": "Nama kategori sudah digunakan",
  "Category not found": "Kategori tidak ditemukan",

  // User messages
  "User created successfully": "Pegawai berhasil ditambahkan",
  "User updated successfully": "Pegawai berhasil diperbarui",
  "User deleted successfully": "Pegawai berhasil dihapus",
  "User status updated successfully": "Status pegawai berhasil diubah",
  "Email already exists": "Email sudah digunakan",
  "Username already exists": "Username sudah digunakan",
  "Cannot delete yourself": "Tidak dapat menghapus akun sendiri",
  "Cannot deactivate yourself": "Tidak dapat menonaktifkan akun sendiri",

>>>>>>> Stashed changes
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
