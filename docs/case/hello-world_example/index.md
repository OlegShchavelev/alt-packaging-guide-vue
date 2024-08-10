# Примеры сборки пакетов с исходными текстами на Python, Bash, С++

Для примера сборки пакетов, будут использоваться простые программы на языках C++, Python, Bash. Программы выводят строку `Hello World!` в терминал.

::: info
**Каждый проект можно скачать из [GitHub репозитория](https://github.com/SokolovValy/Alt_Example_Code).**
:::

## Исходный код

::: details Лицензия

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
```

:::

::: details `bello.sh` (Bash)

```bash
#!/bin/bash

printf "Hello World\n"
```

:::

::: details `pello.py` (Python 3)

```python
#!/usr/bin/env python

print("Hello World")
```

:::

::: details `cello.cpp` (C++)

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

:::

## Подготовка пространства

Создайте дерево каталогов, вручную или командой `rpmdev-setuptree`.

::: code-group

```shell[Автоматически]
$ rpmdev-setuptree
```

```shell[Вручную]
$ mkdir RPM
$ cd RPM
$ mkdir BUILD RPMS SOURCES SPECS SRPMS
```

::: danger
Если была использована утилита `rpmdev-setuptree`, обратите внимание на файл [`~/home/.rpmmacros`](#rpmmacros-warning)
:::

Далее необходимо подготовить каталоги для каждого из трёх проектов:

```shell
$ mkdir bello cello pello
```

Каждый каталог должен содержать в себе исходный код соответствующей программы, лицензию и Spec-файл.

::: info
Следующие действия идентичны для всех трёх каталогов. В примере использован `bello.sh`
:::

Инициализация git-репозитория:

```shell
$ git init
```

Создайте файлы `bello.sh`, `bello.spec` и `LICENSE`.

```shell
$ touch bello.sh bello.spec LICENSE
```

Запишите в файл `bello.sh` код скрипта, а в файл `LICENSE` - лицензию.

::: tip

Bash (`bello.sh`) и Python 3 (`pello.py`) являются скриптовыми языками, поэтому их файлы должны иметь право на исполнение. Добавьте бит исполняемости:

```shell
chmod +x bello.sh
```

:::

Создайте подкаталог `.gear`, перейдите в него и создайте файл `rules`:

```shell
$ mkdir .gear
$ cd .gear
$ touch rules
```

::: details Итоговое наполнение каталога

```shell
$ ls -a
bello
bello.spec
.gear
.git
LICENSE
```

:::

## Spec-файл и правила Gear

::: details Описание `Makefile` для C++
В каталоге cello создайте `Makefile` (файл инструкций для программы Make, которая собирает/компилирует данный проект):

```shell
$ touch Makefile
```

Содержание `Makefile`:

```make
cello:
    gcc -g -o cello cello.c

clean:
    rm cello

install:
    mkdir -p $(DESTDIR)/usr/bin
    install -m 0755 cello $(DESTDIR)/usr/bin/cello
```

:::

### Правила Gear

Заполните файл `.gear/rules`:

```
tar: .
```

::: info
Строка указывает, что проект будет упакован в tar-архив.
:::

### Spec-файл

<!-- TODO: уточнить, BuildRequires или Requires-->

В заголовке или шапке Spec-файла находятся директивы `Name`, `Version`, `Release`, `Summary`, `License`, `Group`, `BuildArch`, `BuildRequires` и `Source0`. Заполните эти директивы:

::: code-group

```txt[Bash]
Name: bello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in Bash
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

Requires: bash
BuildArch: noarch
```

```txt[Python 3]
Name: pello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in Python 3
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

Requires: python3
BuildArch: noarch
```

```txt[C++]
Name: cello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in C++
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

BuildRequires: gcc-g++
BuildRequires: make
```

:::

::: info

<!-- TODO: уточнить, BuildRequires или Requires -->

- Стандартная схема `Name-Version-Release`, содержащая в себе имя пакета, его версию и релиз сборки;
- `Summary` включает в себя краткое описание пакета;
- `License` — лицензия, под которой выпускается программа ( данном случае - GPLv3);
- `Group` — категория, к которой относится пакет. Так как это тестовый пакет для примера, выставим группу `Other`;
- `BuildRequires` и `Requires` — пакеты, необходимые для сборки и запуска готового пакет соответственно. Необходимые пакеты:
  - `Requires`:
    - Bash: `bash`;
    - Python 3: `python3`;
  - `BuildRequires`:
    - C++: `gcc-g++`, `make`;
- `Source0` — путь к архиву с исходниками (`%name-%version.tar`).
- `BuildArch` — целевая архитектура (если не указано, то берётся архитектура машины, на которой собран пакет)

:::

Заполните `%description` и `%prep`:

::: code-group

```txt[Bash]
%description
The long-tail description for our Hello World Example implemented in Bash.

%prep
%setup -q
```

```txt[Python 3]
%description
The long-tail description for our Hello World Example implemented in Python 3.

%prep
%setup -q

# fix python shebang for scripts
grep -R '^#!/usr/bin/\(env[[:space:]]\+\)\?python' . | cut -d: -f1 |
    while read f; do
        sed -E -i '1 s@^(#![[:space:]]*)%_bindir/(env[[:space:]]+)?python$@\1%__python3@' "$f"
    done
```

```txt[C++]
%description
The long-tail description for our Hello World Example implemented in C++.

%prep
%setup -q
```

:::

::: details Примечание для Python 3

Часть кода после комментария `fix python shebang for scripts` это набор команд для обновления шибанга (первой строки в исполняемом файле, которая указывает на интерпретатор, с помощью которого следует выполнять скрипт) в Python-скриптах. В частности, он заменяет старый шибанг `#!/usr/bin/python` на более современный и более гибкий вариант с использованием env `#!/usr/bin/env python`.

- `grep -R '^#!/usr/bin/\(env[[:space:]]\+\)\?python' .` — ищет строки, начинающиеся с шибанга, где указан путь к интерпретатору. Регулярное выражение проверяет шибанг с использованием env для гибкой настройки пути к интерпретатору Python.
- `cut -d: -f1` — используется для обрезания вывода, чтобы получить только имена файлов, содержащих старый шибанг.
- `while read f; do ... done` — цикл, выполняющий команды внутри блока do для каждого из найденных файлов.
- `sed -E -i '1 s@^(#![[:space:]]*)%_bindir/(env[[:space:]]+)?python$@\1%__python3@' "$f"` — изменение первой строки файла. Регулярное выражение заменяет старый шибанг на новый.

:::

::: info

- В секции `%description` находится краткое описание программы;
- Секция `%prep` отвечает за подготовку программы к сборке;
- Макрос `%setup` распаковывает исходный код перед компиляцией.

:::

В секции `%install` описаны инструкции, как установить файлы пакета в систему конечного пользователя:

::: code-group

```txt[Bash]
%install

mkdir -p %buildroot%_bindir
install -m 0755 %name %buildroot%_bindir/%name
```

```txt[Python 3]
%install

mkdir -p %buildroot%_bindir
mkdir -p %buildroot%_libexecdir/%name

cat > %buildroot%_bindir/%name <<-EOF
#!/bin/bash
/usr/bin/python3 %_libexecdir%name/__pycache__/%name.cpython-$(echo %__python3_version | sed 's/\.//').pyc
EOF

chmod 0755 %buildroot%_bindir/%name

install -m 0644 %name.py %buildroot%_libexecdir/%name/
```

```txt[C++]
%build
%make

%install
%makeinstall_std
```

:::

Вместо того, чтобы писать пути установки файлов вручную, будем использовать предопределённые макросы:

`%buildroot%_bindir` будет раскрываться в путь `/usr/bin`. По этому пути будет создан каталог с именем пакета, в который будет помещён файл скрипт с правами доступа 755.

::: details Примечание для Python 3
Здесь создаются две директории в `%buildroot`, которая представляет собой временный корень файловой системы для сборки пакета: `%_bindir` и `%_libexecdir/%name`.
:::

::: details Примечание для C++
В секции `%build` происходит сборка исходного кода. Так как в проекте используется Make, в секции будет указан макрос `%make`
:::

В секции `%files` описано, какие файлы и каталоги с соответствующими атрибутами должны быть скопированы из дерева сборки в rpm-пакет, а затем копироваться в целевую систему при установке этого пакета. Все три файла из пакета будут распакованы по путям, описанным в секции `%install`:

::: code-group

```txt[Bash, C++]
%files
%doc LICENSE
%_bindir/%name
```

```txt[Python]
%files
%doc LICENSE
%dir %_libexecdir/%name/
%_bindir/%name
%_libexecdir/%name/%name.py
%_libexecdir/%name/__pycache__/*.py*
```

:::

Секция `%changelog` — описаны изменения внесённые в ПО, патчи, изменения методологии сборки

::: code-group

```txt[Bash]
%changelog
* Mon  date name <email@adress.com> 0.1-alt1
- First bello package
```

```txt[Python 3]
%changelog
* Date name <email@address.com> 0.1.1-alt1
- First pello package
```

```txt[C++]
%changelog
* Date Name <mail@address.org> 1.0-alt1
- First cello package
```

:::

::: details Полные Spec-файлы

::: code-group

```txt[Bash]
Name: bello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in Bash
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

Requires: bash
BuildArch: noarch

%description
The long-tail description for our Hello World Example implemented in Bash.

%prep
%setup -q

%install

mkdir -p %buildroot%_bindir
install -m 0755 %name %buildroot%_bindir/%name

%files
%doc LICENSE
%_bindir/%name

%changelog
* Mon  date name <email@adress.com> 0.1-alt1
- First bello package
```

```txt[Python 3]
Name: pello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in Python 3
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

Requires: python3
BuildArch: noarch

%description
The long-tail description for our Hello World Example implemented in Python 3.

%prep
%setup -q

# fix python shebang for scripts
grep -R '^#!/usr/bin/\(env[[:space:]]\+\)\?python' . | cut -d: -f1 |
    while read f; do
        sed -E -i '1 s@^(#![[:space:]]*)%_bindir/(env[[:space:]]+)?python$@\1%__python3@' "$f"
    done

%install

mkdir -p %buildroot%_bindir
mkdir -p %buildroot%_libexecdir/%name

cat > %buildroot%_bindir/%name <<-EOF
#!/bin/bash
/usr/bin/python3 %_libexecdir%name/__pycache__/%name.cpython-$(echo %__python3_version | sed 's/\.//').pyc
EOF

chmod 0755 %buildroot%_bindir/%name

install -m 0644 %name.py %buildroot%_libexecdir/%name/

%files
%doc LICENSE
%dir %_libexecdir/%name/
%_bindir/%name
%_libexecdir/%name/%name.py
%_libexecdir/%name/__pycache__/*.py*

%changelog
* Date name <email@address.com> 0.1.1-alt1
- First pello package
```

```txt[C++]
Name: cello
Version: 0.1.1
Release: alt1
Summary: Hello World example implemented in C++
Group: Other

License: GPLv3+
URL: https://github.com/altlinux/alt-packaging-guide/tree/master/example-code

Source0: %{name}-%{version}.tar

BuildRequires: gcc-g++
BuildRequires: make

%description
The long-tail description for our Hello World Example implemented in C++.

%prep
%setup -q

%build
%make

%install
%makeinstall_std

%files
%doc LICENSE
%_bindir/%name

%changelog
* Date Name <mail@address.org> 1.0-alt1
- First cello package
```

:::

## Сборка пакета

Перейдите в основную директорию репозитория и добавьте файлы в отслеживание git-репозитория:

::: code-group

```shell[Bash]
$ git add bello.sh bello.spec LICENSE .gear/rules
```

```shell[Python]
$ git add pello.py pello.spec LICENSE .gear/rules
```

```shell[C++]
$ git add сello.cpp Makefile cello.spec LICENSE .gear/rules
```

:::

```shell
$ git commit -m "First commit"
```

### Gear

Запустите сборку с помощью Gear:

```shell
$ gear-rpm -ba
```

Если сборка прошла успешно, собранный пакет будет находиться в `~/RPM/RPMS/noarch`

### Gear + Hasher

Запустите сборку с помощью Gear и Hasher:

```shell
$ gear-hsh --no-sisyphus-check --commit -v
```

Если сборка прошла успешно, собранный пакет будет находиться в `~/hasher/repo/x86_64/RPMS.hasher`

::: info
В зависимости от языка, имя пакета будет `bello-0.1-alt1.noarch.rpm`, `pello-0.1-alt1.noarch.rpm` или `cello-0.1-alt1.noarch.rpm`
:::
