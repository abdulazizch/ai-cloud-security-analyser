# PHP Vulns Demo (for local testing only)

## Setup
1. Create DB and table:
   - Import `schema.sql` into your local MySQL/MariaDB.
2. Serve PHP files (e.g. `php -S 127.0.0.1:8080` in this folder).
3. Try:
   - `http://127.0.0.1:8080/index.php?email=admin@example.com&password=admin123`
   - SQLi pattern example (intentionally unsafe concatenation in `index.php`).
4. Insecure upload at `http://127.0.0.1:8080/upload.php`
