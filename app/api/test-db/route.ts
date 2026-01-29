import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test 1: Tüm kategorileri çek
    const { data: allCategories, error: allError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    // Test 2: Slug ile kategori çek (query kodundaki gibi)
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'dis-implantlari')
      .eq('is_active', true)
      .single()
    
    // Test 3: Slug ile kategori çek (filtresiz)
    const { data: categoryNoFilter, error: noFilterError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'dis-implantlari')
      .single()
    
    return NextResponse.json({
      allCategories: {
        count: allCategories?.length || 0,
        error: allError,
        data: allCategories,
      },
      categoryWithFilter: {
        error: catError,
        data: category,
      },
      categoryNoFilter: {
        error: noFilterError,
        data: categoryNoFilter,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}