# Введение в пакетные менеджеры

**RPM** — это семейство пакетных менеджеров, применяемых в различных дистрибутивах GNU/Linux, в том числе и в проекте [Сизиф](https://www.altlinux.org/Sisyphus) и в дистрибутивах [Альт](https://www.altlinux.org/Releases). Практически каждый крупный проект, использующий RPM, имеет свою версию пакетного менеджера, отличающуюся от остальных.

Различия между представителями семейства RPM:

- Набор макросов, используемых в Spec-файлах;
- Различное поведение RPM при сборке по умолчанию — при отсутствии каких-либо указаний в Spec-файлах;
- Формат строк зависимостей;
- Мелкие отличия в семантике операций, например, в операциях сравнения версий пакетов;
- Мелкие отличия в формате файлов.

Для пользователя различия чаще всего заключаются в невозможности поставить «неродной» пакет из-за проблем с зависимостями или из-за формата пакета.

RPM в проекте Сизиф также не является исключением. Основные отличия RPM в ALT и Сизиф от RPM других крупных проектов заключаются в следующем:

- обширный набор макросов для сборки различных типов пакетов;
- отличающееся поведение по умолчанию для уменьшения количества шаблонного кода в Spec-файлах;
- наличие механизмов для автоматического поиска межпакетных зависимостей;
- наличие так называемых set-version зависимостей (начиная с `4.0.4-alt98.46` ), обеспечивающих дополнительный контроль за изменением ABI библиотек;
- до `p8` и выпусков `8.x` включительно -- очень древняя версия «базового» RPM (4.0.4), от которого началось развитие ветки RPM в Sisyphus (в Sisyphus и `p9` осуществлён частичный переход на `rpm 4.13`).

## Основные команды RPM

Для ознакомления с данным разделом потребуется пакет. В качестве примера мы будем использовать пакет [Yodl-docs](http://ftp.altlinux.org/pub/distributions/ALTLinux/p10/branch/noarch/RPMS.classic/yodl-docs-4.03.00-alt2.noarch.rpm).

### Как узнать информацию о RPM-пакете без установки?

После скачивания пакета можно посмотреть данные о нём перед установкой. Для этого можно использовать комбинацию `-qip`: Query, Install и Package.

::: info

Ключ `-p` (`--package`) работает не с базой RPM-пакетов, а с конкретным пакетом. Например: чтобы получить информацию о файлах, находящихся в пакете, который не установлен в систему, используют ключи `-qpl`.

:::

```
$ rpm -qip yodl-docs-4.03.00-alt2.noarch.rpm
```

::: details Вывод

```
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

### Как установить RPM-пакет?

Для установки можно использовать флаги `--install`, `--verbose` и `--hash` или их короткую комбинацию `-ivh`.

::: info
Флаги `-v` и `-h` не влияют на установку, а служат для отображения процесса сборки:

- `-v` (`--verbose`) — выводит детальные значения;
- `-h` (`--hash`) — отображает полоску прогресса.

:::

```shell
$ rpm -ivh yodl-docs-4.03.00-alt2.noarch.rpm
```

::: details Вывод

```
Подготовка...                ############################################################ [100%]
Обновление / установка...
1: yodl-docs-1:4.03.00-alt2  ############################################################ [100%]
Running /usr/lib/rpm/posttrans-filetriggers
```

:::

### Проверка, установлен ли пакет с конкретным именем

Для поиска пакетов есть флаг `--query` (`-q`).

```shell
$ rpm -q yodl-docs
```

::: details Вывод

```
yodl-docs-4.03.00-alt2.noarch
```

:::

Утилита `grep` позволяет найти соответствия даже по частичному запросу в списке всех установленных пакетов

```shell
$ rpm -qa | grep yodl
```

::: details Вывод

```
yodl-docs-4.03.00-alt2.noarch
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

### Определение пакета, которому принадлежит файл

Для того, что нужно узнать, к какому конкретному пакету относится файл, можно использовать ключи `--query` (`-q`) и `--file` (`-f`):

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

Для обновления пакета используется параметр ключи `--update`, `--verbose` и `--hash`:

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
