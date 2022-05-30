const template = `

export interface database {
  public: {
    tables: {
      <% tables.forEach(function(table){ %>
          <%= table.name %>: {},
      <% }); %>
    },
    functions: {
      <% functions.forEach(function(fn){ %>
          <%= fn.name %>: {},
      <% }); %>
    }
  }
}

`.trim()

export default template
