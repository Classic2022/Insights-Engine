import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://roakqwmuaeprwirvhuon.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWtxd211YWVwcndpcnZodW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5Nzg2NTcsImV4cCI6MjA0NjU1NDY1N30.-iDw4UzzwnnJLbszQbnTbNJ02wTHurKpFFHpXRyhGMo";

export const supabase = createClient(supabaseUrl, supabaseKey);
