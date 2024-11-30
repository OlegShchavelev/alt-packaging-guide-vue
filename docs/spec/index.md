# Spec-файл

## Что такое Spec-файл

Spec-файл можно рассматривать как сценарий, который утилита `rpmbuild` использует для сборки RPM-пакета. Он сообщает системе сборки, что делать, определяя инструкции в разделах.

Разделы определены в **Преамбуле** (метаданные) и **Основной части** (тело сценария)

::: details Пример Spec-файла

Данный пример взять из [ALT Linux Wiki](https://www.altlinux.org/SampleSpecs/program).

```
Name: sampleprog
Version: 1.0
Release: alt1

Summary: Sample program specfile
Summary(ru_RU.UTF-8): Пример спек-файла для программы

License: GPLv2+
Group: Development/Other
Url: http://www.altlinux.org/SampleSpecs/program

Source: %name-%version.tar
Patch0: %name-1.0-alt-makefile-fixes.patch

%description
This specfile is provided as sample specfile for packages with programs.
It contains most of usual tags and constructions used in such specfiles.

%description -l ru_RU.UTF-8
Этот спек-файл является примером спек-файла для пакета с программой. Он содержит
основные теги и конструкции, используемые в подобных спек-файлах.

%prep
%setup
%patch0 -p1

%build
%configure
%make_build

%install
%makeinstall_std
%find_lang %name

%files -f %name.lang
%doc AUTHORS ChangeLog NEWS README THANKS TODO contrib/ manual/
%_bindir/*
%_man1dir/*

%changelog
* Sat Sep 33 3001 Sample Packager <sample@altlinux.org> 1.0-alt1
- initial build

```

:::

## Разделы преамбулы

В этой таблице перечислены элементы, используемые в разделе преамбулы файла спецификации RPM:

| Директива       | Определение                                                                                                                                                                                                                                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Name`          | Базовое имя пакета, которое должно совпадать с именем Spec-файла.                                                                                                                                                                                                                                                                                           |
| `Version`       | Версия upstream-кода.                                                                                                                                                                                                                                                                                                                                       |
| `Release`       | Указание номера сборки пакета при данной версии upstream-кода. Как правило, имя релиза начинается с `alt1`, а номер инкрементируется с каждым новым выпуском, например: `alt1`, `alt2`, `alt3` и так далее. Сбросьте значение до alt1 при создании новой версии программного обеспечения.                                                                   |
| `Summary`       | Краткое, в одну строку, описание пакета.                                                                                                                                                                                                                                                                                                                    |
| `License`       | Лицензия на собираемое программное обеспечение.                                                                                                                                                                                                                                                                                                             |
| `Group`         | Категории, к которым относится пакет. Группа должна быть взята из файла `/usr/lib/rpm/GROUPS`, поставляемого вместе с пакетом `rpm`.                                                                                                                                                                                                                        |
| `URL`           | Полный URL-адрес для получения дополнительной информации о программе. Чаще всего это ссылка на **GitHub** upstream-проекта для собираемого программного обеспечения.                                                                                                                                                                                        |
| `Source0`       | Путь или URL-адрес к сжатому архиву исходного кода (не исправленный, исправления обрабатываются в другом месте). Должен указывать на доступное и надежное хранилище архива, например, на upstream-страницу, а не локальное хранилище сборщика. Можно указывать дополнительные директивы, инкрементируя индекс: `Source1`, `Source2`, `Source3` и так далее. |
| `Patch0`        | Название патча, который при необходимости будет применён к исходному коду. Можно указывать дополнительные директивы, инкрементируя индекс: `Patch1`, `Patch2`, `Patch3` и так далее.                                                                                                                                                                        |
| `BuildArch`     | Если пакет не зависит от архитектуры, например, если он полностью написан на интерпретируемом языке программирования, установите для этого значение `noarch`. Если этот параметр не задан, пакет автоматически наследует архитектуру компьютера, на котором он собран, например `x86_64`.                                                                   |
| `BuildRequires` | Разделённый запятыми или пробелами список пакетов, необходимых для сборки программы. Может быть несколько записей, каждая в отдельной строке в Spec-файле.                                                                                                                                                                                                  |
| `Requires`      | Разделённый запятыми или пробелами список пакетов, необходимых программному обеспечению для запуска после установки. Это его **зависимости**. Может быть несколько записей, каждая в отдельной строке в Spec-файле.                                                                                                                                         |
| `ExcludeArch`   | Если часть программного обеспечения не может работать на определенной архитектуре процессора, данную архитектуру можно исключить                                                                                                                                                                                                                            |

Директивы `Name`, `Version` и `Release` являются частями имени RPM-пакета. Эти директивы часто называют `N-V-R` или `NVR`, поскольку имена RPM-пакетов имеют формат `NAME-VERSION-RELEASE`.

Получить пример `NAME-VERSION-RELEASE`, выполнив запрос с использованием `rpm` для конкретного пакета:

```shell
$ rpm -q rpmdevtools
rpmdevtools-8.10-alt2.noarch
```

::: info
`rpmdevtools` - это имя пакета, `8.10` - версия, `alt2` - релиз. Последний маркер `noarch` - сведения об архитектуре.

В отличие от `NVR`, маркер архитектуры не находится под прямым управлением сборщика, а определяется средой сборки `rpmbuild`. Исключением является архитектурно-независимый пакет — `noarch`.
:::

## Составляющие основной части

В этой таблице перечислены элементы, используемые в теле файла спецификации RPM-пакета:

| Директива      | Определение                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `%description` | Полное описание программного обеспечения. Это описание может занимать несколько строк и может быть разбито на абзацы.                                                                                                                                                                                                                                                                                                                                    |
| `%prep`        | Одна или несколько команд для подготовки программного обеспечения к сборке, например, распаковка архива из `Source0`. Эта директива может содержать сценарий оболочки (bash-скрипт).                                                                                                                                                                                                                                                                     |
| `%build`       | Одна или несколько команд для трансляции программного обеспечения в машинный код (для компилируемых языков) или байт-код (для некоторых интерпретируемых языков).                                                                                                                                                                                                                                                                                        |
| `%install`     | Раздел, который во время сборки пакета эмулирует конечные пути установки файлов в систему. Одна или несколько команд для копирования требуемых артефактов сборки из `%builddir` (место сборка) в `%buildroot` (структура каталогов с файлами, подлежащими сборке). Обычно это означает копирование файлов из `~/rpmbuild/BUILD` в `~/rpmbuild/BUILDROOT` и создание необходимых подкаталогов. Выполняется только при создании (не при установке) пакета. |
| `%check`       | Одна или несколько команд для тестирования программного обеспечения. Обычно включает модульные и другие тесты.                                                                                                                                                                                                                                                                                                                                           |
| `%files`       | Список файлов, которые будут установлены в системе конечного пользователя.                                                                                                                                                                                                                                                                                                                                                                               |
| `%changelog`   | Список изменений для версии или релиза пакета.                                                                                                                                                                                                                                                                                                                                                                                                           |

::: info
Директива `%setup` в Sisyphus RPM использует флаг `-q` по умолчанию, поэтому `%setup -q` и `%setup` — полностью идентичны.

Если использовать конструкцию с флагом `-v`, то будет выведена дополнительная информация в логах сборки
:::

## Проверка RPM пакета

После создания пакета желательно проверить его качество (качество собранного пакета, а не программного обеспечения). Основным инструментом для этого является статический анализатор
[`rpmlint`](https://github.com/rpm-software-management/rpmlint).

::: tip
`rpmlint` имеет очень строгие правила. Иногда некоторые ошибки и предупреждения допустимы.
:::

Статический анализ RPM улучшает читаемость, обеспечивает проверку работоспособности и выявление ошибок. Эта утилита может проверять бинарные и исходные RPM (SRPM) файлы, а также Spec-файлы. `rpmlint` будет полезен на всех этапах упаковки.

::: info
В примерах `rpmlint` запускается без каких-либо опций (упрощённый вывод). Для получения подробных объяснений ошибок и предупреждений можно использовать флаг `-i`.
:::

::: danger
Для примера ошибки будут проигнорированы, но для реальных пакетов их необходимо исправлять.
:::

### Проверка Spec-файла

#### `bello`

```shell
$ rpmlint bello.spec
```

::: details Вывод

```shell
bello.spec: W: invalid-url Source0: https://www.example.com/bello/releases/bello-0.1.tar.gz HTTP Error 404: Not Found
0 packages and 1 specfiles checked; 0 errors, 1 warnings.
```

:::

Наблюдения:

- Предупреждение `invalid-url Source0`: URL-адрес, указанный в директиве `Source0`, недоступен. Это ожидаемо, так как указанного URL-адреса не существует.

#### `pello`

```shell
$ rpmlint pello.spec
```

::: details Вывод

```shell
pello.spec:30: E: hardcoded-library-path in %{buildroot}/usr/lib/%{name}
pello.spec:34: E: hardcoded-library-path in /usr/lib/%{name}/%{name}.pyc
pello.spec:39: E: hardcoded-library-path in %{buildroot}/usr/lib/%{name}/
pello.spec:43: E: hardcoded-library-path in /usr/lib/%{name}/
pello.spec:45: E: hardcoded-library-path in /usr/lib/%{name}/%{name}.py*
pello.spec: W: invalid-url Source0: https://www.example.com/pello/releases/pello-0.1.1.tar.gz HTTP Error 404: Not Found
0 packages and 1 specfiles checked; 5 errors, 1 warnings.
```

:::

Наблюдения:

- Аналогичное предупреждение `invalid-url`.
- Ошибки `hardcoded-library-path`: требуется использование макроса `%{_libdir}` вместо жесткого указания пути к библиотеке.

::: info
Ошибок много, так как файл спецификации был намеренно сформирован так, чтобы показать, о каких ошибках может сообщать `rpmlint`.
:::

#### `cello`

```shell
$ rpmlint ~/rpmbuild/SPECS/cello.spec
```

::: details Вывод

```shell
/home/admiller/rpmbuild/SPECS/cello.spec: W: invalid-url Source0: https://www.example.com/cello/releases/cello-1.0.tar.gz HTTP Error 404: Not Found
0 packages and 1 specfiles checked; 0 errors, 1 warnings.
```

:::

Наблюдения:

- Аналогичные предупреждения `invalid-url`.

### Проверка SRPM

#### `bello`

```shell
$ rpmlint ~/rpmbuild/SRPMS/bello-0.1-1.el7.src.rpm
```

::: details Вывод

```shell
bello.src: W: invalid-url URL: https://www.example.com/bello HTTP Error 404: Not Found
bello.src: W: invalid-url Source0: https://www.example.com/bello/releases/bello-0.1.tar.gz HTTP Error 404: Not Found
1 packages and 0 specfiles checked; 0 errors, 2 warnings.
```

:::

Наблюдения:

- Предупреждения `invalid-url URL` и `invalid-url Source0`: URL-адрес, указанный в директивах `URL` и `Source0`, недоступен. Это ожидаемо, так как указанного URL-адреса не существует.

#### `pello`

```shell
$ rpmlint ~/rpmbuild/SRPMS/pello-0.1.1-1.el7.src.rpm
```

::: details Вывод

```shell
pello.src: W: invalid-url URL: https://www.example.com/pello HTTP Error 404: Not Found
pello.src:30: E: hardcoded-library-path in %{buildroot}/usr/lib/%{name}
pello.src:34: E: hardcoded-library-path in /usr/lib/%{name}/%{name}.pyc
pello.src:39: E: hardcoded-library-path in %{buildroot}/usr/lib/%{name}/
pello.src:43: E: hardcoded-library-path in /usr/lib/%{name}/
pello.src:45: E: hardcoded-library-path in /usr/lib/%{name}/%{name}.py*
pello.src: W: invalid-url Source0: https://www.example.com/pello/releases/pello-0.1.1.tar.gz HTTP Error 404: Not Found
1 packages and 0 specfiles checked; 5 errors, 2 warnings.
```

:::

Наблюдения:

- Аналогичные предупреждения `invalid-url`.
- Ошибки `hardcoded-library-path`: требуется использование макроса `%{_libdir}` вместо жёсткого указания пути к библиотеке.

#### `cello`

```shell
$ rpmlint ~/rpmbuild/SRPMS/cello-1.0-1.el7.src.rpm
```

::: details Вывод

```shell
cello.src: W: invalid-url URL: https://www.example.com/cello HTTP Error 404: Not Found
cello.src: W: invalid-url Source0: https://www.example.com/cello/releases/cello-1.0.tar.gz HTTP Error 404: Not Found
1 packages and 0 specfiles checked; 0 errors, 2 warnings.
```

:::

Наблюдения:

- Аналогичные предупреждения `invalid-url`.

### Проверка RPM

#### `bello`

Для бинарных RPM-файлов, `rpmlint` проверяет дополнительные параметры, в том числе, документацию и последовательное использование

```shell
$ rpmlint ~/rpmbuild/RPMS/noarch/bello-0.1-1.el7.noarch.rpm
```

::: details Вывод

```shell
bello.noarch: W: invalid-url URL: https://www.example.com/bello HTTP Error 404: Not Found
bello.noarch: W: no-documentation
bello.noarch: W: no-manual-page-for-binary bello
1 packages and 0 specfiles checked; 0 errors, 3 warnings.
```

:::

Наблюдения:

- Предупреждение `invalid-url URL`: URL-адрес, указанный в директиве `URL`, недоступен. Это ожидаемо, так как указанного URL-адреса не существует.
- Предупреждения `no-documentation` и `no-manual-page-for-binary`: в RPM пакете нет документации или страниц руководства.

#### `pello`

```shell
$ rpmlint ~/rpmbuild/RPMS/noarch/pello-0.1.1-1.el7.noarch.rpm
```

::: details Вывод

```shell
pello.noarch: W: invalid-url URL: https://www.example.com/pello HTTP Error 404: Not Found
pello.noarch: W: only-non-binary-in-usr-lib
pello.noarch: W: no-documentation
pello.noarch: E: non-executable-script /usr/lib/pello/pello.py 0644L /usr/bin/env
pello.noarch: W: no-manual-page-for-binary pello
1 packages and 0 specfiles checked; 1 errors, 4 warnings.
```

:::

Наблюдения:

- Аналогичное предупреждение `invalid-url`.
- Аналогичные предупреждения `no-documentation` и `no-manual-page-for-binary`
- Предупреждение `only-non-binary-in-usr-lib`: предоставлены только бинарные артефакты `/usr/lib/`. Этот каталог обычно зарезервирован для общих объектных файлов, которые являются бинарными. Следовательно, `rpmlint` ожидает, что по крайней мере один или несколько файлов в `/usr/lib/` будут бинарными.

::: info
Обычно для обеспечения правильного размещения файлов используются макросы RPM. Ради этого примера мы можем проигнорировать это предупреждение.
:::

- Ошибка с названием `non-executable-script`: файл `/usr/lib/pello/pello.py` не имеет бита выполнение. Поскольку этот файл содержит [шебанг](<https://ru.wikipedia.org/wiki/Шебанг_(Unix)>), `rpmlint` ожидает, что файл будет исполняемым. Для целей примера, файл будет без разрешений на выполнение.

#### `cello`

```shell
$ rpmlint ~/rpmbuild/RPMS/x86_64/cello-1.0-1.el7.x86_64.rpm
```

::: details Вывод

```shell
cello.x86_64: W: invalid-url URL: https://www.example.com/cello HTTP Error 404: Not Found
cello.x86_64: W: no-documentation
cello.x86_64: W: no-manual-page-for-binary cello
1 packages and 0 specfiles checked; 0 errors, 3 warnings.
```

:::

Наблюдения:

- Аналогичное предупреждение `invalid-url`.
- Аналогичные предупреждения `no-documentation` и `no-manual-page-for-binary`
