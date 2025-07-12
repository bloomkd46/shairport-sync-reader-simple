## 1.0.0-beta.9
* Fixed a bug causing some metadata to be lost due to incorrect XML processing (it would remain on the XML string indefinitely, which was also (in theory) causing memory leaks)

## 1.0.0-beta.8
* Made the existing sync loops capable of reading the new data containing newlines

## 1.0.0-beta.7
* Re-added the newline normalization to the XML string to ensure proper parsing (It somehow vanished in the last commit)

## 1.0.0-beta.6
* Fixed a bug causing some events to be emitted multiple times due to overlapping async loops

## 1.0.0-beta.5
* Fixed a bug causing newlines to break the parser
* Fixed a bug causing the matched section to not be removed from the XML string after processing

## 1.0.0-beta.4
* Added support for some core metadata

## 1.0.0-beta.3
* Made sure that function types are now exported

## 1.0.0-beta.2
* Added missing type files

## 1.0.0-beta.1
* Initial release of shairport-sync-reader-simple
* Added basic metadata extraction functionality
* Implemented TypeScript types for metadata structure