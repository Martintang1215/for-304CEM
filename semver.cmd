@ECHO off
SETLOCAL
CALL :find_dp0

SET _maybeQuote="
IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET _maybeQuote=
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

%_maybeQuote%%_prog%%_maybeQuote%  "%dp0%\..\..\..\_semver@5.7.1@semver\bin\semver" %*
ENDLOCAL
EXIT /b %errorlevel%
:find_dp0
SET dp0=%~dp0
EXIT /b
