# Примеры сборки пакетов с использованием инструментов ALT

Для примера сборки пакета будем использовать программу для вывода системных уведомлений о текущей дате и времени. Ссылка на github-репозиторий с исходными текстами программ на языках C++ ([Notification](https://github.com/MakDaffi/notification)) и Python ([DBusTimer_Example](https://github.com/danila-Skachedubov/DBusTimer_example))

Структура репозиториев для данных программ идентична: Главный файл (`.cpp`/`.py`) и два юнита `systemd` (`.service` и `.timer`)

## Создание пакета из проекта на Python

- Файл `.timer` — по истечении времени запустит скрипт, который выводит уведомление о дате и времени. После срабатывания таймер снова начинает отсчёт до запуска скрипта;

- Файл `.service` - содержит описание, расположение скрипта и интерпретатора, который будет обрабатывать скрипт.

Первым шагом необходимо склонировать репозиторий в рабочую директорию, используя команду `git`:

```shell
$ git clone https://github.com/danila-Skachedubov/DBusTimer_example.git
```

Создайте каталог `.gear` и перейдите в него:

```shell
$ mkdir .gear
$ cd .gear/
```

Создайте два файла: правила для Gear (`rules`) и Spec-файл (`dbustimer.spec`):

```shell
$ touch rules dbustimer.spec
```

После всех изменений содержание каталога проекта примет следующий вид:

```shell
$ ls -a
.gear .git script_dbus.py script_dbus.service script_dbus.timer
$ ls .gear/
dbustimer.spec  rules
```

## Spec-файл и правила Gear

В файле `.gear/rules` укажите следующее:

```
tar: .
spec: .gear/dbustimer.spec
```

::: info
Первая строка указывает, что проект будет упакован в tar-архив;
Вторая строка указывает путь к Spec-файлу.
:::

В заголовке или шапке Spec-файла находятся директивы `Name`, `Version`, `Release`, `Summary`, `License`, `Group`, `BuildArch`, `BuildRequires` и `Source0`. Заполните эти директивы:

```
Name: dbustimer
Version: 0.4
Release: alt1

Summary: Display system time
License: GPLv3+
Group: Other
BuildArch: noarch

BuildRequires: rpm-build-python3
```

::: info

- Стандартная схема `Name-Version-Release`, содержащая в себе имя пакета, его версию и релиз сборки;
- `Summary` включает в себя краткое описание пакета;
- `License` — лицензия, под которой выпускается программа ( данном случае - GPLv3);
- `Group` — категория, к которой относится пакет. Так как это тестовый пакет для примера, выставим группу `Other`;
- `BuildRequires` — пакеты, необходимые для сборки. Так как исходный код написан на Python 3, необходим пакет `rpm-build-python3` с макросами для сборки скриптов Python;
- `Source0` — путь к архиву с исходниками (`%name-%version.tar`).

:::

Заполните `%description` и `%prep`.

```
%description
This program displays notifications about the system time with a frequency of one hour.

%prep
%setup -q
```

::: info

- В секции `%description` находится краткое описание программы;
- Секция `%prep` отвечает за подготовку программы к сборке;
- Макрос `%setup` распаковывает исходный код перед компиляцией.

:::

В секции `%install` описаны инструкции, как установить файлы пакета в систему конечного пользователя.

Вместо того, чтобы писать пути установки файлов вручную, будем использовать предопределённые макросы:

- `%python3_sitelibdir_noarch` будет раскрываться в путь `/usr/lib/python3/site-packages`. По этому пути будет создан каталог с именем пакета, в который будет помещён файл `script_dbus.py` с правами доступа 755;
- Аналогичная операция будет проведена с файлами `script_dbus.timer` и `script_dbus.service`. Они должны быть установлены по пути `/etc/xdg/systemd/user`. Так как макроса, раскрывающегося в данный путь нет, будет использован макрос `%_sysconfdir`, который раскрывается в путь `/etc`.

```
%install

mkdir -p %buildroot%python3_sitelibdir_noarch/%name/
install -Dm0755 script_dbus.py %buildroot%python3_sitelibdir_noarch/%name/

mkdir -p %buildroot%_sysconfdir/xdg/systemd/user/
cp script_dbus.timer script_dbus.service %buildroot%_sysconfdir/xdg/systemd/user/
```

::: info
Первая команд создаёт каталог `dbustimer` в окружении `buildroot` по пути `/usr/lib/python3/site-packages`.

Втроая устанавливает файл `script_dbus.py` с правами 755 в каталог `/usr/lib/python3/site-packages/dbustimer/` в окружении `buildroot`

Аналогично создаётся каталог `%buildroot%_sysconfdir/xdg/systemd/user/`, в который копируются файлы `.service` и `.timer`
:::

В секции `%files` описано, какие файлы и каталоги с соответствующими атрибутами должны быть скопированы из дерева сборки в rpm-пакет, а затем копироваться в целевую систему при установке этого пакета. Все три файла из пакета будут распакованы по путям, описанным в секции `%install`:

```
%files
%python3_sitelibdir_noarch/%name/script_dbus.py
/etc/xdg/systemd/user/script_dbus.service
/etc/xdg/systemd/user/script_dbus.timer
```

Секция `%changelog` — описаны изменения внесённые в ПО, патчи, изменения методологии сборки:

```
%changelog
* Thu Apr 13 2023 Danila Skachedubov <dan@altlinux.org> 0.4-alt1
- Update system
- Changed access rights
```

::: details Полный Spec-файл

```
Name: dbustimer
Version: 0.4
Release: alt1

Summary: Display system time
License: GPLv3+
Group: Other
BuildArch: noarch

BuildRequires: rpm-build-python3

Source0: %name-%version.tar

%description
This program displays notifications about the system time with a frequency of one hour.

%prep
%setup

%install

mkdir -p %buildroot%python3_sitelibdir_noarch/%name/
install -Dm0755 script_dbus.py %buildroot%python3_sitelibdir_noarch/%name/

mkdir -p %buildroot%_sysconfdir/xdg/systemd/user/
cp script_dbus.timer script_dbus.service %buildroot%_sysconfdir/xdg/systemd/user/

%files
%python3_sitelibdir_noarch/%name/script_dbus.py
/etc/xdg/systemd/user/script_dbus.service
/etc/xdg/systemd/user/script_dbus.timer

%changelog
* Thu Apr 13 2023 Danila Skachedubov <dan@altlinux.org> 0.4-alt1
- Update system
- Changed access rights
```

:::

Перейдите в основную директорию репозитория и добавьте файлы в отслеживание git-репозитория:

```shell
$ git add .gear/rules .gear/dbustimer.spec
```

После добавление файлов, запустите сборку с помощью инструментов Gear и Hasher следующей командой:

```shell
$ gear-hsh --no-sisyphus-check --commit -v
```

Если сборка прошла успешно, собранный пакет `dbustimer-0.4-alt1.noarch.rpm` будет находится в каталоге `~/hasher/repo/x86_64/RPMS.hasher/`.

## Создание пакета из проекта на C++

Ссылка на GitHub репозиторий: [Notification](https://github.com/MakDaffi/notification).

В репозитории находятся следующие файлы:

1. `.gear` — каталог с правилами Gear и Spec-файлом
2. `Makefile` — набор инструкций для программы Make, которая собирает данный проект.
3. `notify.cpp` — исходный код программы
4. `notify.service` — юнит данной программы для `systemd`
5. `notify.timer` — юнит `systemd`, запускающий вывод уведомления о дате и времени с переодичностью в один час.

В каталоге `.gear` находятся два файла:

1. `rules` — правила для упаковки архива для Gear
2. `notify.spec` — файл спецификации для сборки пакета

### `rules`

```
tar: .
spec: .gear/notify.spec
```

Первая строка - указания для Gear, в какой формат упаковать файлы для последующей сборки. В данном проекте архив будет иметь вид `name-version.tar`.

Вторая строка - путь к Spec-файлу с инструкциями по сборке текущего пакета.

### `notify.spec`

::: details Содержание файла

```
Name: notify
Version: 0.1
Release: alt1

Summary: Display system time every hour
License: GPLv3+
Group: Other

BuildRequires: make
BuildRequires: gcc-c++
BuildRequires: libsystemd-devel Работа с ключами разработчика.

Создание заявки

Source0: %name-%version.tar

%description
This test program displays system date and time every hour via notification

%prep
%setup -q

%build
%make_build

%install

mkdir -p \
	%buildroot/bin/
install -Dm0644 %name %buildroot/bin/

mkdir -p \
	%buildroot%_sysconfdir/xdg/systemd/user/
cp %name.timer %name.service \
	%buildroot%_sysconfdir/xdg/systemd/user/

%files
/bin/%name
/etc/xdg/systemd/user/%name.service
/etc/xdg/systemd/user/%name.timer

%changelog
* Thu Apr 13 2023 Sergey Okunkov <sok@altlinux.org> 0.1-alt1
- Finished my task
```

:::

Преамбула Spec-файла:

```
Name: notify
Version: 0.1
Release: alt1

Summary: Display system time every hour
License: GPLv3+
Group: Other

BuildRequires: make
BuildRequires: gcc-c++
BuildRequires: libsystemd-devel

Source0: %name-%version.tar
```

::: info

- Стандартная схема `Name-Version-Release`, содержащая в себе имя пакета, его версию и релиз сборки;
- `Summary` включает в себя краткое описание пакета;
- `License` — лицензия, под которой выпускается программа ( данном случае - GPLv3);
- `Group` — категория, к которой относится пакет. Так как это тестовый пакет для примера, выставим группу `Other`;
- `BuildRequires` — пакеты, необходимые для сборки. Так как исходный код написан на C++, необходимы пакеты `g++` (компилятор), `make` (система сборки) и `libsystemd-devel` (библиотека работы с модулями `systemd`);
- `Source0` — путь к архиву с исходниками (`%name-%version.tar`).

:::

Тело Spec-файла, или же его основная часть:

```
%description
This test program displays system date and time every hour via notification

%prep
%setup -q

%build
%make

%install

mkdir -p \
	%buildroot/bin/
install -Dm0644 %name %buildroot/bin/

mkdir -p \
	%buildroot%_sysconfdir/xdg/systemd/user/
cp %name.timer %name.service \
	%buildroot%_sysconfdir/xdg/systemd/user/

%files
/bin/%name
/etc/xdg/systemd/user/%name.service
/etc/xdg/systemd/user/%name.timer
```

- `%description` — краткое описание программы;
- `%prep` — подготовка программы к сборке;
  - `%setup` — макрос для распаковки исходного кода перед компиляцией;
- `%build` — сборка проекта;

  - `%make_build` — макрос, использующий `Makefile` для сборки программы;

- `%install` — эмуляция конечных путей при установке файлов в систему. Перенос файлов в `%buildroot` в те пути, куда файлы будут помещены после установки пакета в систему пользователя. Так как файла три, для каждого пропишем конечный путь:

  1. `notify` — скомпилированный бинарный файл. В Unix-подобных системах бинарные файлы располагаются в каталоге `/bin`;
     `mkdir -p %buildroot/bin` — команда создания `/bin` в окружении `%buildroot`;
     `install -Dm0644 %name %buildroot/bin/` — установка бинарного файла `notify` в каталог `%buildroot/bin` с правами доступа 644.

  2. `%name.timer`, `%name.service` — юниты `systemd`. Данные юниты относятся к пользовательским и находятся в `/etc/xdg/systemd/user/`.
     `mkdir -p %buildroot%_sysconfdir/xdg/systemd/user/` — команда создания `/etc/xdg/systemd/user/` в окружении `%buildroot`, где `%_sysconfdir` заменится на `/etc`;
     `cp %name.timer %name.service %buildroot%_sysconfdir/xdg/systemd/user/` — перенос файлов по заданному пути в окружении `%buildroot`.

- `%files` — описывает какие файлы и директории будут скопированы в систему при установке пакета.
