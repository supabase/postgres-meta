// This file includes all route input schemas

import { Static, Type } from '@sinclair/typebox'

const limit = Type.Optional(Type.Integer())
const offset = Type.Optional(Type.Integer())

export const columnPermissionListSchema = Type.Object({
  table_schema: Type.Optional(Type.String()),
  table_name: Type.Optional(Type.String()),
  column_name: Type.Optional(Type.String()),
  privilege: Type.Optional(
    Type.Union([Type.Literal('SELECT'), Type.Literal('INSERT'), Type.Literal('UPDATE')])
  ),
  include_system_schemas: Type.Optional(
    Type.Boolean({
      default: false,
    })
  ),
  limit,
  offset,
})
export type ColumnPermissionListSchema = Static<typeof columnPermissionListSchema>

export const permissionListSchema = Type.Object({
  table_schema: Type.Optional(Type.String()),
  table_name: Type.Optional(Type.String()),
  column_name: Type.Optional(Type.String()),
  privilege: Type.Optional(
    Type.Union([Type.Literal('SELECT'), Type.Literal('INSERT'), Type.Literal('UPDATE')])
  ),
  include_system_schemas: Type.Optional(
    Type.Boolean({
      default: false,
    })
  ),
  limit,
  offset,
})
export type PermissionListSchema = Static<typeof permissionListSchema>

