import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Pakai service role untuk hapus data user sepenuhnya
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Verifikasi user exists
    const { data: userCheck } = await supabase.auth.admin.getUserById(userId)
    if (!userCheck?.user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // 1. Hapus tree_members di mana user jadi collaborator
    await supabase.from('tree_members').delete().eq('user_id', userId)

    // 2. Hapus invites yang user buat
    await supabase.from('tree_invites').delete().eq('invited_by', userId)

    // 3. Hapus trees yang user miliki (persons akan ikut cascade)
    // Foto akan masuk queue cleanup karena trigger
    await supabase.from('trees').delete().eq('owner_id', userId)

    // 4. Hapus payment history (opsional — kadang perlu simpan untuk audit)
    // await supabase.from('trakteer_payments').delete().eq('matched_user_id', userId)
    // await supabase.from('payments').delete().eq('user_id', userId)

    // 5. Hapus profile
    await supabase.from('profiles').delete().eq('id', userId)

    // 6. Hapus dari auth.users (final step)
    const { error: authErr } = await supabase.auth.admin.deleteUser(userId)
    if (authErr) {
      console.error('Gagal hapus auth user:', authErr)
      return NextResponse.json({ error: 'Gagal hapus akun auth', detail: authErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Hapus akun error:', err)
    return NextResponse.json({ error: 'Server error', detail: err.message }, { status: 500 })
  }
}
