import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqpstdudpttmimlunefv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcHN0ZHVkcHR0bWltbHVuZWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNzExOTIsImV4cCI6MjA3Mjc0NzE5Mn0.NUiKTvShkE4uaWzGc_InH_okeKPPs2Kc95MA8kND8IM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);