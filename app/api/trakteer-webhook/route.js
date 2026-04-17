import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const WEBHOOK_TOKEN = process.env.TRAKTEER_WEBHOOK_TOKEN

// Ekstrak email dari pesan supporter (case-insensitive)
function extractEmail(text) {
  if (!text) return null
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  return match ? match[0].toLowerCase().trim() : null
}

export async function POST(req) {
  try {
    // Verifikasi token dari header (keamanan)
    const token = req.headers.get('x-webhook-token')
    if (!WEBHOOK_TOKEN && !token) {
      console.warn('Trakteer webhook: no token configured — accepting all (UNSAFE for production)')
    } else if (WEBHOOK_TOKEN && token !== WEBHOOK_TOKEN) {
      console.error('Trakteer webhook: invalid token')
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }

    const body = await req.json()
    const {
      transaction_id,
      type,
      supporter_name,
      supporter_message,
      price, // harga per unit (Trakteer field)
      quantity,
      unit_name,
      order_amount, // total dibayar
    } = body

    // Gunakan service role (bypass RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    if (!transaction_id) {
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 })
    }

    // Cegah duplikasi — cek apakah transaksi sudah pernah diproses
    const { data: existing } = await supabase
      .from('trakteer_payments')
      .select('id, status')
      .eq('transaction_id', transaction_id)
      .single()

    if (existing?.status === 'activated') {
      console.log(`Trakteer: tx ${transaction_id} already activated, skipping`)
      return NextResponse.json({ status: 'already_processed' })
    }

    // Ekstrak email dari pesan supporter
    const email = extractEmail(supporter_message)
    const totalAmount = order_amount || (price * (quantity || 1)) || 29000

    // Log transaksi
    const logPayload = {
      transaction_id,
      supporter_name: supporter_name || null,
      supporter_message: supporter_message || null,
      amount: totalAmount,
      quantity: quantity || 1,
      unit_name: unit_name || null,
      matched_email: email,
      status: email ? 'matched' : 'unmatched',
      raw_payload: body,
    }

    // Cari user by email
    let matched_user_id = null
    if (email) {
      // Cari di auth.users via admin API
      const { data: usersList } = await supabase.auth.admin.listUsers()
      const foundUser = usersList?.users?.find(u => u.email?.toLowerCase() === email)

      if (foundUser) {
        matched_user_id = foundUser.id

        // Cek apakah transaksi cukup untuk aktivasi premium (min Rp 29.000)
        if (totalAmount >= 29000) {
          // Aktifkan premium
          await supabase.from('profiles').update({
            is_premium: true,
            premium_since: new Date().toISOString(),
            premium_order_id: `TRAKTEER-${transaction_id}`,
          }).eq('id', matched_user_id)

          logPayload.matched_user_id = matched_user_id
          logPayload.status = 'activated'

          console.log(`✅ Trakteer: Premium activated for ${email} (tx: ${transaction_id})`)
        } else {
          logPayload.matched_user_id = matched_user_id
          logPayload.status = 'matched'
          console.log(`⚠️ Trakteer: ${email} bayar ${totalAmount} (<29000), belum cukup untuk premium`)
        }
      } else {
        console.log(`⚠️ Trakteer: email ${email} tidak ditemukan di user Sulalah`)
      }
    } else {
      console.log(`⚠️ Trakteer: tx ${transaction_id} tidak ada email di pesan`)
    }

    // Insert atau update log
    await supabase.from('trakteer_payments').upsert(logPayload, { onConflict: 'transaction_id' })

    return NextResponse.json({ status: 'ok', matched: !!matched_user_id, activated: logPayload.status === 'activated' })

  } catch (err) {
    console.error('Trakteer webhook error:', err)
    return NextResponse.json({ error: 'Server error', detail: err.message }, { status: 500 })
  }
}

// Trakteer menggunakan GET untuk test endpoint, kita terima juga
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'Sulalah Trakteer Webhook' })
}
