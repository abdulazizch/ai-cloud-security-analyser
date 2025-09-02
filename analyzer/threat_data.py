# Unified threat database for the analyzer.
THREAT_DATABASE = [
    # ==========================
    # SQL Injection
    # ==========================
    {
        "label": "SQL Injection (concatenated WHERE)",
        "pattern": r"\bSELECT\b.+\bFROM\b.+\bWHERE\b.+(\+|\|\|).+",
        "description": "Dynamic SQL with string concatenation in WHERE clause can enable injection.",
        "recommendation": "Use parameterized queries / prepared statements.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "SQL Injection (unparameterized execute)",
        "pattern": r"\b(cursor|db|conn)\.\s*execute\(\s*[\"']\s*(SELECT|INSERT|UPDATE|DELETE)\b.+[\"']\s*\+\s*.+\)",
        "description": "Unvalidated input concatenated into SQL query for execute().",
        "recommendation": "Use placeholders and parameter binding.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "SQL Pattern (generic)",
        "pattern": r"\bSELECT\b.+\bFROM\b.+\bWHERE\b.+",
        "description": "SQL statement with WHERE clause detected. Review for parameterization.",
        "recommendation": "Use parameterized queries or ORM methods.",
        "severity": "High",
        "use_regex": True,
    },

    # ==========================
    # Cross-Site Scripting (XSS)
    # ==========================
    {
        "label": "Cross-Site Scripting (innerHTML)",
        "pattern": r"\binnerHTML\s*=\s*[^;]+",
        "description": "Assigning possibly tainted data to innerHTML can cause XSS.",
        "recommendation": "Prefer textContent or safe templating with auto-escaping.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Cross-Site Scripting (document.write)",
        "pattern": r"\bdocument\.write\(\s*.+\s*\)",
        "description": "Writing untrusted data into the DOM may execute scripts.",
        "recommendation": "Avoid document.write(); sanitize/encode output.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "XSS (PHP echo of request param)",
        "pattern": r"echo\s*\$_(GET|POST)\[[\"'][^\"']+[\"']\]\s*;",
        "description": "Direct echo of request parameter can cause reflected XSS.",
        "recommendation": "Encode output (htmlentities/escaper) before printing.",
        "severity": "High",
        "use_regex": True,
    },

    # ==========================
    # Command Injection
    # ==========================
    {
        "label": "Command Injection (os.system)",
        "pattern": r"\bos\.system\(\s*[^)]+\s*\)",
        "description": "os.system with untrusted input may lead to remote code execution.",
        "recommendation": "Use subprocess.run([...], shell=False) and validate inputs.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Command Injection (subprocess shell=True)",
        "pattern": r"\bsubprocess\.(call|run|Popen)\([^)]*shell\s*=\s*True[^)]*\)",
        "description": "shell=True executes via a shell; unsafe with tainted inputs.",
        "recommendation": "Avoid shell=True; pass an argument list and validate inputs.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Command Injection (PHP exec/system)",
        "pattern": r"\b(exec|shell_exec|system|passthru)\(\s*\$_(GET|POST)\[[\"'][^\"']+[\"']\]\s*\)",
        "description": "Executing request parameters is dangerous and may enable RCE.",
        "recommendation": "Do not execute user input; whitelist commands or remove these calls.",
        "severity": "Critical",
        "use_regex": True,
    },

    # ==========================
    # Hardcoded Credentials / Secrets
    # ==========================
    {
        "label": "Hardcoded Credentials",
        "pattern": r"\b(pass(word)?|passwd|pwd|secret|token|api[_-]?key)\b\s*[:=]\s*[\"'][^\"']+[\"']",
        "description": "Hardcoded credential-like string present in source.",
        "recommendation": "Use environment variables or secret managers.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Hardcoded Secret (generic token)",
        "pattern": r"[\"'][A-Za-z0-9_\-]{32,}[\"']",
        "description": "Long token-like string detected in code.",
        "recommendation": "Move secrets to env vars or secret managers.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "AWS Access Key ID pattern",
        "pattern": r"\bAKIA[0-9A-Z]{16}\b",
        "description": "AWS Access Key ID found.",
        "recommendation": "Rotate credentials; use IAM roles/STS.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Framework Secret Key Exposed",
        "pattern": r"\b(SECRET_KEY|DJANGO_SECRET_KEY|FLASK_SECRET_KEY)\s*=\s*['\"][^'\"]+['\"]",
        "description": "Leaking framework secret keys breaks session/signing security.",
        "recommendation": "Load secrets from environment/secret store; rotate keys.",
        "severity": "High",
        "use_regex": True,
    },

    # ==========================
    # Insecure Deserialization
    # ==========================
    {
        "label": "Insecure Deserialization (pickle)",
        "pattern": r"\bpickle\.loads?\(\s*[^)]+\s*\)",
        "description": "pickle load of untrusted data can execute code.",
        "recommendation": "Avoid pickle for untrusted input; use JSON or safe formats.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Insecure Deserialization (PHP unserialize)",
        "pattern": r"\bunserialize\(\s*\$_(POST|GET)\[[\"'][^\"']+[\"']\]\s*\)",
        "description": "Unserializing request parameters can instantiate arbitrary objects.",
        "recommendation": "Avoid unserialize on untrusted input; use JSON or safe formats.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "Unsafe YAML Load",
        "pattern": r"\byaml\.load\(",
        "description": "yaml.load without a SafeLoader can execute arbitrary code on crafted input.",
        "recommendation": "Use yaml.safe_load or specify SafeLoader.",
        "severity": "High",
        "use_regex": True,
    },

    # ==========================
    # Insecure File Handling
    # ==========================
    {
        "label": "Insecure File Upload (PHP)",
        "pattern": r"\bmove_uploaded_file\(\s*\$_FILES\[[\"']\w+[\"']\]\[[\"']tmp_name[\"']\]\s*,",
        "description": "Saving uploaded files without validation.",
        "recommendation": "Validate MIME/type/extension; sanitize name; store outside web root.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Path Traversal (concat path)",
        "pattern": r"\bopen\(\s*['\"][^'\"]*[/\\]['\"]\s*\+\s*\w+",
        "description": "File path built with user input may allow traversal.",
        "recommendation": "Normalize and validate paths; use allowlists; avoid string concatenation.",
        "severity": "Critical",
        "use_regex": True,
    },
    {
        "label": "File Inclusion (PHP)",
        "pattern": r"\b(include|require)(_once)?\(\s*\$_(GET|POST)\[[\"'][^\"']+[\"']\]",
        "description": "Including files based on request parameters (LFI/RFI risk).",
        "recommendation": "Avoid dynamic inclusion; map IDs to safe paths.",
        "severity": "Critical",
        "use_regex": True,
    },

    # ==========================
    # Weak / Inappropriate Crypto
    # ==========================
    {
        "label": "Weak Hashing Algorithm (MD5, Python)",
        "pattern": r"\bhashlib\.md5\(",
        "description": "MD5 is weak and not suitable for passwords or signatures.",
        "recommendation": "Use bcrypt/argon2/scrypt for passwords; SHA-256/HMAC for integrity.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Weak Hashing Algorithm (SHA1, Python)",
        "pattern": r"\bhashlib\.sha1\(",
        "description": "SHA-1 is deprecated for new uses.",
        "recommendation": "Prefer SHA-256 or better; use KDFs for passwords.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Insecure Encryption Mode (AES-ECB)",
        "pattern": r"\bAES\.new\([^)]*MODE_ECB",
        "description": "AES ECB mode leaks patterns in ciphertext and is insecure.",
        "recommendation": "Use AEAD modes (AES-GCM/ChaCha20-Poly1305) with random nonces.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Weak Encryption (generic md5)",
        "pattern": "md5(",
        "description": "Use of MD5 for cryptographic hashing is insecure.",
        "recommendation": "Use SHA-256 or stronger algorithms; for passwords use a KDF.",
        "severity": "Medium",
        "use_regex": False,
    },

    # ==========================
    # Randomness
    # ==========================
    {
        "label": "Predictable Random (fixed seed)",
        "pattern": r"\brandom\.seed\(\s*\d+\s*\)",
        "description": "Fixed RNG seed makes tokens predictable.",
        "recommendation": "Use secrets or os.urandom for security-sensitive randomness.",
        "severity": "Medium",
        "use_regex": True,
    },
    {
        "label": "Insecure Temp File",
        "pattern": r"\btempfile\.mktemp\(",
        "description": "mktemp() is race-prone and insecure.",
        "recommendation": "Use NamedTemporaryFile or mkstemp instead.",
        "severity": "Medium",
        "use_regex": True,
    },

    # ==========================
    # Transport / HTTP
    # ==========================
    {
        "label": "SSL Verification Disabled",
        "pattern": r"\brequests\.(get|post|put|delete|patch)\([^)]*verify\s*=\s*False",
        "description": "Disabling TLS certificate verification enables MITM attacks.",
        "recommendation": "Leave verification enabled or pin certificates.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Insecure Protocol (HTTP)",
        "pattern": "http://",
        "description": "Using HTTP instead of HTTPS exposes traffic to interception.",
        "recommendation": "Use HTTPS for all sensitive communications.",
        "severity": "Low",
        "use_regex": False,
    },

    # ==========================
    # Cloud / Config Misconfigurations
    # ==========================
    {
        "label": "AWS S3 Public Bucket",
        "pattern": r"\"ACL\"\s*:\s*\"public-read\"",
        "description": "S3 bucket/object ACL allows public read.",
        "recommendation": "Use private buckets; least-privilege via IAM.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "GCP Storage Public ACL",
        "pattern": r"\"allUsers\"\s*:\s*\"READER\"",
        "description": "GCS bucket grants public reader.",
        "recommendation": "Restrict to specific identities/service accounts.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Azure Blob Public Access",
        "pattern": r"publicAccess\s*:\s*['\"]container['\"]",
        "description": "Azure Blob container allows public access.",
        "recommendation": "Set access level to private or use SAS tokens.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "Overly Permissive Network Rule",
        "pattern": "0.0.0.0/0",
        "description": "Allowing open access from all IPs can expose services publicly.",
        "recommendation": "Restrict CIDR ranges to trusted sources only.",
        "severity": "Critical",
        "use_regex": False,
    },

    # ==========================
    # Auth / Session / CORS
    # ==========================
    {
        "label": "Logging Sensitive Data",
        "pattern": r"\blogging\.(debug|info|warning|error)\([^)]*(pass(word)?|token|secret)[^)]*\)",
        "description": "Passwords or secrets must never be logged.",
        "recommendation": "Remove secrets from logs or mask them.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "JWT 'none' Algorithm",
        "pattern": r"\"alg\"\s*:\s*\"none\"",
        "description": "Using the 'none' algorithm disables JWT signature verification.",
        "recommendation": "Use a strong signing algorithm (e.g., HS256/RS256) and verify signatures.",
        "severity": "High",
        "use_regex": True,
    },
    {
        "label": "CORS Wildcard",
        "pattern": r"\bAccess-Control-Allow-Origin\s*[:=]\s*['\"]\*['\"]",
        "description": "Allowing all origins can expose APIs to abuse.",
        "recommendation": "Set an explicit origin allowlist.",
        "severity": "Medium",
        "use_regex": True,
    },
]
