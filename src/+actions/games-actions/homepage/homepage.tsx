'use server';

import { redirect } from 'next/navigation';

export async function searchByKeyword(data: FormData) {
  return redirect(`/browse?keyword=${data.get('keyword')}`);
}
