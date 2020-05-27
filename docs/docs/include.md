# Including files

Include content from separate markdown files either by using the `include::filename[]` or `!INCLUDE filename` syntax or by configuring them in the header of your markdown file.

The configuration below will include the files `_file1.md`, `_file2.md` and `_file3.md` from the `/source/includes` path. (Please note that the files will have to begin with an `_` and end with a `.md` extension)

```
---
title: MyAPI v1.0.0
includes:
  - file1
  - file2
  - file3
---
```

If you wish to include files relative to the shins root path instead just begin the name with a `/`.

The configuration below will include the files `file1.md`, `file2.md` and `file3.md` from `shins/myfolder`. (Please note that the files have to end with a `.md` extension)
```
---
title: MyAPI v1.0.0
includes:
  - /myfolder/file1
  - /myfolder/file2
  - /myfolder/file3
---
```

The same example if you include files using [widdershins](https://github.com/Mermade/widdershins/).
```
--includes '/myfolder/file1,/myfolder/file2,/myfolder/file3'
```
