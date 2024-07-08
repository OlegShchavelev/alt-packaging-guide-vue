# RPM Макросы

Макросы RPM — это прямые текстовые подстановки, которые происходят путем замены определенных выражений и условий на соответствующий текст во время процесса сборки пакета. Имена макросов начинаются с символа `**%**`. Они представляют собой сокращенные псевдонимы для часто используемых фрагментов текста.

Для чего нужны макросы:

* **Обеспечить желаемую функциональность:**  
    Пакеты в репозитории Сизиф должны отвечать определённым правилам, для этого `spec`-файлы должны обеспечивать выполнение этих правил.
* **Помощь разработчику:** 
    `spec`-файлы пишут люди, следовательно, их работу нужно свести к минимуму, который и требует участия человека. Майнтейнер не должен копировать блоки кода из файла в файл, так как данная работа занимает время, силы, и чревата ошибками. Для таких случаев существуют **макросы**.  Если какой-то код появляется в разных `spec`-файлах более одного раза, то надо написать макрос(ы).
* **Сделать spec-файлы более читабельными:**

Людям, пересобирающим пакет, или собирающим новый аналогичный пакет, опираясь на другие ``spec``-файлы, будет удобнее, если в наименовании, расположении и использовании различных элементов `spec`-файлов будет определенный порядок.

Просмотреть список доступных макросов и их значения можно, выполнив команду:

```
rpm --showrc
```

Получить значение, раскрываемое макросом можно, использовав команду `rpm --eval {<имя_макроса>}`.

У нас есть макрос `%_sysconfdir`. Раскроем его:

```
$ rpm --eval %_sysconfdir

/etc
```

Макросы можно использовать внутри других макросов. Так, например, если название архива исходных текстов проекта формируется из его имени и версии (директивы Name и Version транслируются в определённые макросы, о чём будет рассказано ниже), то директива задания пути к файлу может выглядеть следующим образом:

```
Source0: %{name}-%{version}.tar.gz
```

## Макросы путей системных каталогов

В этой таблице представлены макросы системных путей
|====
| Макрос  | Замена | Описание
| ``%_usr	`` | /usr | ------
|``%_var``|/var|-----
|``%_bindir``|/usr/bin|----
|``%_sbindir``|/usr/sbin|----
|``%_libexecdir``|/usr/lib|----
|``%_localstatedir``|/var/lib|----
|``%_datadir``|/usr/share|----
|``%_tmpfilesdir``|/lib/tmpfiles.d|----   
|``%_desctopdir``|/usr/share/application|----
|``%_``||----
|====

### Макросы меню 
|====
|``%_menudir``|/usr/lib/menu|----
|``%_iconsdir``|/usr/share/icons|----
|``%_miconsdir``|/usr/share/icons/hicolor/16x16/apps|----
|``%_liconsdir``|/usr/share/icons/hicolor/48x48/apps|----
|====

### Другие системные макросы
|====
|``%_initdir``|/etc/rc.d/init.d|----
|``%_lockdir``|/var/lock|----
|``%_logdir``|/var/log|----
|====

### Прочие макросы
|====
|``%intel``|i386 i486 i586 i686 i786 i886 i986 pentium2 pentium3 pentium4| Cписок архитектур _intel_, совместимых с _i386_
|``%amd``|k6 athlon athlon_xp| Cписок архитектур _amd_, совместимых с _i386_,
|``%ix86``|i386 i486 i586 i686 i786 i886 i986 pentium2 pentium3 pentium4 k6 athlon athlon_xp| Cписок всех архитектур, совместимых с _i386_;
|====

|====

|``%_``||----
|``%_``||----
|``%_``||----
|``%_``||----
|``%_``||----
|``%_``||----
|``%_``||----

|====

Подробный список предопределённых макросов Вы можете найти на страницах: [Предопределённые макросы](https://www.altlinux.org/Spec/Предопределенные_макросы) и [Макросы по категориям](https://www.altlinux.org/Особенности_написания_спек_файлов_в_ALT_Linux). 

## Пользовательские макросы