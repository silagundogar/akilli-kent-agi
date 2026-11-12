-- ==============================================================
-- 🏙️ AKILLI KENT AĞI (AKA) - SUPABASE (POSTGRESQL) VERİTABANI ŞEMASI
-- ==============================================================
-- Bu SQL kodunu Supabase Dashboard > "SQL Editor" bölümüne yapıştırıp
-- "RUN" butonuna basarak 5 saniyede veritabanınızı oluşturabilirsiniz.

-- 1. İhbarlar & Arıza Tablosu (issues)
create table if not exists public.issues (
  id text primary key,
  code text unique not null,
  title text not null,
  "desc" text,
  category text,
  department text,
  urgency text default 'Normal',
  status text default 'Yeni',
  neighborhood text,
  address text,
  lat double precision,
  lng double precision,
  "citizenName" text,
  "citizenPhone" text,
  "isAnonymous" boolean default false,
  "createdAt" text,
  "assignedTeam" text,
  "fieldNote" text,
  "imgBefore" text,
  "imgAfter" text,
  rating integer,
  feedback text,
  history jsonb default '[]'::jsonb
);

-- 2. Hızlı Arama & Filtreleme İndeksleri
create index if not exists idx_issues_code on public.issues(code);
create index if not exists idx_issues_status on public.issues(status);
create index if not exists idx_issues_category on public.issues(category);
create index if not exists idx_issues_created_at on public.issues("createdAt");

-- 3. Güvenlik Politikaları (Row Level Security - RLS)
alter table public.issues enable row level security;

-- Herkes ihbarları okuyabilir (Vatandaş haritası ve ihbar sorgulama için)
drop policy if exists "Herkes ihbarları görebilir" on public.issues;
create policy "Herkes ihbarları görebilir"
  on public.issues for select
  using (true);

-- Herkes yeni arıza ihbarı gönderebilir (Vatandaş portalı)
drop policy if exists "Herkes yeni ihbar ekleyebilir" on public.issues;
create policy "Herkes yeni ihbar ekleyebilir"
  on public.issues for insert
  with check (true);

-- İhbarlar güncellenebilir (Belediye sevk ve çözüm işlemleri için)
drop policy if exists "Herkes ihbarları güncelleyebilir" on public.issues;
create policy "Herkes ihbarları güncelleyebilir"
  on public.issues for update
  using (true);

-- İhbar silme
drop policy if exists "Herkes ihbar silebilir" on public.issues;
create policy "Herkes ihbar silebilir"
  on public.issues for delete
  using (true);

-- 4. CANLI BİLDİRİM (REALTIME) AKTİF ET
-- Bu sayede vatandaş telefondan ihbar açtığı anda belediyenin ekranında anında zil çalar!
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'issues'
  ) then
    alter publication supabase_realtime add table public.issues;
  end if;
end $$;
