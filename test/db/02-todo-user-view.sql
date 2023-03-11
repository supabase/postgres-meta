CREATE VIEW todos_with_user_view AS (
  SELECT todos.id, todos.details, users AS user FROM public.todos 
  LEFT JOIN users ON todos."user-id" = users.id
);