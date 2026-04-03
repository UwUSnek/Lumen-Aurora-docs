from pathlib import Path;




ROOT_DIRS: list[str] = [
    "./Page",
    "./Scripts",
    "./Styles"
]
OUTPUT_FILE = Path("./Tools/LineCounterOutput.txt")
SKIP_PATHS: list[str] = [
    # Empty
]
EXTENSIONS = {
    ".html": "HTML",
    ".htm":  "HTML",
    ".css":  "CSS",
    ".js":   "JS",
}




def count_lines(path: Path) -> int:
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            return sum(1 for _ in f)
    except OSError:
        return 0




def main():

    # For each root directory
    skip_resolved = { Path(p).resolve() for p in SKIP_PATHS }
    totals: dict[str, int] = { "HTML": 0, "CSS": 0, "JS": 0 }
    for ROOT_DIR in ROOT_DIRS:
        _dir = Path(ROOT_DIR)

        # Check root directory
        if not _dir.exists():
            raise SystemExit(f"ERROR: Directory '{_dir}' does not exist.")

        # Count lines
        for file in sorted(_dir.rglob("*")):
            if not file.is_file():
                continue
            kind = EXTENSIONS.get(file.suffix.lower())
            if kind is None or file.resolve() in skip_resolved:
                continue
            totals[kind] += count_lines(file)


    # Create output string
    lines_out: list[str] = []
    for kind in ("HTML", "CSS", "JS"):
        lines_out.append(f"{ kind }: {totals[kind] :,} lines")
    report = " | ".join(lines_out)


    # Print to file
    OUTPUT_FILE.write_text(report, encoding="utf-8")




if __name__ == "__main__":
    main()