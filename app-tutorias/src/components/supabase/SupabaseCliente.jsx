import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://itiwanyeuidisxsegfsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aXdhbnlldWlkaXN4c2VnZnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0OTc5MDQsImV4cCI6MjA0NTA3MzkwNH0.3VBHA6aaL0-SkqzIvh8_yrbDRz6t_3olxxce0CsJEoc';

export const supabase = createClient(supabaseUrl, supabaseKey);