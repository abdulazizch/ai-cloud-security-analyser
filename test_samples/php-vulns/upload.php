<?php
// Intentionally insecure upload handler.
// Accepts any file type and stores it in /uploads without verification.

$targetDir = __DIR__ . "/uploads/";
if (!file_exists($targetDir)) {
  mkdir($targetDir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $targetFile = $targetDir . basename($_FILES["file"]["name"]);
  // No MIME check, no size limit, no sanitization — BAD by design for testing.
  if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
    echo "Uploaded: " . htmlspecialchars($_FILES["file"]["name"]);
  } else {
    echo "Upload failed.";
  }
} else {
  ?>
  <!doctype html>
  <html><body>
    <h1>Insecure File Upload</h1>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  </body></html>
  <?php
}
