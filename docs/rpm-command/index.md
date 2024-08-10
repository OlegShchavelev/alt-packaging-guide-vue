# Основные команды RPM

::: info
В качестве примера для этой статьи будет использоваться пакет [Yodl (`yodl-docs`)](http://ftp.altlinux.org/pub/distributions/ALTLinux/p10/branch/noarch/RPMS.classic/yodl-docs-4.03.00-alt2.noarch.rpm).
:::

## Информация об RPM-пакете

После скачивания пакета, можно одной командой посмотреть данные о нём и установить, использовав комбинацию флагов `Query`, `Install` и `Package`.

::: info
Флаг `-p` (`--package`) работает не с базой RPM-пакетов, а с конкретным пакетом
:::

Чтобы получить информацию о файлах, находящихся в неустановленном пакете, можно использовать флаги `Query`, `Package` и `List`: `-qpl`.

```shell
$ rpm -qip yodl-docs-4.03.00-alt2.noarch.rpm
```

::: details Вывод

```shell
Name        : yodl-docs
Epoch       : 1
Version     : 4.03.00
Release     : alt2
DistTag     : sisyphus+271589.100.1.2
Architecture: noarch
Install Date: (not installed)
Group       : Documentation
Size        : 3701571
License     : GPL
Signature   : DSA/SHA1, Чт 13 мая 2021 05:44:49, Key ID 95c584d5ae4ae412
Source RPM  : yodl-4.03.00-alt2.src.rpm
Build Date  : Чт 13 мая 2021 05:44:44
Build Host  : darktemplar-sisyphus.hasher.altlinux.org
Relocations : (not relocatable)
Packager    : Aleksei Nikiforov <darktemplar@altlinux.org>
Vendor      : ALT Linux Team
URL         : https://gitlab.com/fbb-git/yodl
Summary     : Documentation for Yodl
Description :
Yodl is a package that implements a pre-document language and tools to
process it.  The idea of Yodl is that you write up a document in a
pre-language, then use the tools (eg. yodl2html) to convert it to some
final document language.  Current converters are for HTML, ms, man, LaTeX
SGML and texinfo, plus a poor-man's text converter.  Main document types
are "article", "report", "book" and "manpage".  The Yodl document
language is designed to be easy to use and extensible.

This package contais documentation for Yodl.
```

:::

### Установка RPM-пакета

Для установки можно использовать флаги `--install`, `--verbose` и `--hash` или их сокращённую комбинацию `-ivh`.

::: info

Флаги `-v` и `-h` не влияют на установку, а служат для отображения процесса сборки:

- `-v` (`--verbose`) — выводит детальные значения;
- `-h` (`--hash`) — отображает полоску прогресса.

:::

```shell
$ rpm -ivh yodl-docs-4.03.00-alt2.noarch.rpm
```

::: details Вывод

```shell
Подготовка...                ############################################################ [100%]
Обновление / установка...
1: yodl-docs-1:4.03.00-alt2  ############################################################ [100%]
Running /usr/lib/rpm/posttrans-filetriggers
```

:::

### Проверка, установлен ли пакет с конкретным именем

Для поиска пакетов есть флаг `Query`: `-q`.

```shell
$ rpm -q yodl-docs
```

::: details Вывод

```shell
yodl-docs-4.03.00-alt2.noarch
```

:::

Утилита `grep` позволит найти соответствия даже с частичным запросом в списке всех установленных пакетов

```
$ rpm -qa | grep yodl
```

::: details Вывод

```
yodl-docs-4.03.00-alt2.noarch
```

:::

### Просмотр файлов установленного пакета

```
$ rpm -ql yodl-docs
```

::: details Вывод

```
/usr/share/doc/yodl
/usr/share/doc/yodl-doc
/usr/share/doc/yodl-doc/AUTHORS.txt
/usr/share/doc/yodl-doc/CHANGES
/usr/share/doc/yodl-doc/changelog
/usr/share/doc/yodl-doc/yodl.dvi
/usr/share/doc/yodl-doc/yodl.html
/usr/share/doc/yodl-doc/yodl.latex
/usr/share/doc/yodl-doc/yodl.pdf
/usr/share/doc/yodl-doc/yodl.ps
/usr/share/doc/yodl-doc/yodl.txt
/usr/share/doc/yodl-doc/yodl01.html
/usr/share/doc/yodl-doc/yodl02.html
/usr/share/doc/yodl-doc/yodl03.html
/usr/share/doc/yodl-doc/yodl04.html
/usr/share/doc/yodl-doc/yodl05.html
/usr/share/doc/yodl-doc/yodl06.html
/usr/share/doc/yodl/AUTHORS.txt
/usr/share/doc/yodl/CHANGES
/usr/share/doc/yodl/changelog
```

:::

### Просмотр недавно установленных пакетов

```shell
$ rpm -qa --last | head
```

::: info

Утилита `head` позволяет вывести содержание первых 10 строк переданного ей текста

Чтобы увидеть полный лог, можно убрать часть `| head`

:::

::: details Вывод

```shell
yodl-docs-4.03.00-alt2.noarch                 Чт 22 дек 2022 18:09:10
source-highlight-3.1.9-alt1.git.904949c.x86_64 Вт 20 дек 2022 18:38:29
libsource-highlight-3.1.9-alt1.git.904949c.x86_64 Вт 20 дек 2022 18:38:29
gem-asciidoctor-doc-2.0.10-alt1.noarch        Вт 20 дек 2022 18:34:04
w3m-0.5.3-alt4.git20200502.x86_64             Вт 20 дек 2022 18:23:05
sgml-common-0.6.3-alt15.noarch                Вт 20 дек 2022 18:23:05
libmaa-1.4.7-alt4.x86_64                      Вт 20 дек 2022 18:23:05
docbook-style-xsl-1.79.1-alt4.noarch          Вт 20 дек 2022 18:23:05
docbook-dtds-4.5-alt1.noarch                  Вт 20 дек 2022 18:23:05
dict-1.12.1-alt4.1.x86_64                     Вт 20 дек 2022 18:23:05
```

:::

### Определение пакета, которму принадлежит файл

Для того, что нужно узнать, к какому конкретному пакету относится файл, можно использовать ключи `Query` и `File`:

```shell
$ rpm -qf /usr/share/doc/yodl-doc
```

::: details Вывод

```shell
yodl-docs-4.03.00-alt2.noarch
```

:::

### Вывод информации о пакете

```shell
$ rpm -qi yodl-docs
```

::: details Вывод

```shell
Name        : yodl-docs
Epoch       : 1
Version     : 4.03.00
Release     : alt2
DistTag     : sisyphus+271589.100.1.2
Architecture: noarch
Install Date: Чт 22 дек 2022 18:09:10
Group       : Documentation
Size        : 3701571
License     : GPL
Signature   : DSA/SHA1, Чт 13 мая 2021 05:44:49, Key ID 95c584d5ae4ae412
Source RPM  : yodl-4.03.00-alt2.src.rpm
Build Date  : Чт 13 мая 2021 05:44:44
Build Host  : darktemplar-sisyphus.hasher.altlinux.org
Relocations : (not relocatable)
Packager    : Aleksei Nikiforov <darktemplar@altlinux.org>
Vendor      : ALT Linux Team
URL         : https://gitlab.com/fbb-git/yodl
Summary     : Documentation for Yodl
Description :
Yodl is a package that implements a pre-document language and tools to
process it.  The idea of Yodl is that you write up a document in a
pre-language, then use the tools (eg. yodl2html) to convert it to some
final document language.  Current converters are for HTML, ms, man, LaTeX
SGML and texinfo, plus a poor-man's text converter.  Main document types
are "article", "report", "book" and "manpage".  The Yodl document
language is designed to be easy to use and extensible.
```

:::

### Обновление пакета

Для обновления пакета используется параметр ключи `Update`, `Verbose` и `Hash`:

```shell
$ rpm -Uvh yodl-docs-4.03.00-alt2.noarch.rpm
```

::: details Вывод

```shell
 Подготовка...             ############################################################ [100%]
	пакет yodl-docs-1:4.03.00-alt2.noarch уже установлен
```

:::

## Другие ключи

Справку по всем ключам можно получить в справке RPM:

```shell
$ rpm --help
```
