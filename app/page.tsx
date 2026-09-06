import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  console.log("todos", todos);

  return (
    <>
      <h1>Hello, World</h1>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
}
