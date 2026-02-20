# To do

- replace all outputs of examples with outputs generated using the compiler
  - generate the colors too, using the same system the vsc extension uses

- benchmark the compiled code and compare it to other languages
  - show benchmark results in the documentation
  - also show how the code gets optimized & benchmark both the optimized version and unoptimized one (--o-none)

- add a "since version x.y.z" to each feature or something like that

- remove " and ' from keywords. they aren't keywords, they are literal definitions that use reserved tokens

- remove "limits" standard module. This stuff should be part of the primitive types' reflection data
- remove "types" too, no idea what it was meant for but its probably useless

- Improve page sliding animation

- Raw text literal r"" that treats all escapes as a normal characters instead of sequences with special meaning
  - double-quotes inside of raw literals must be written as 2 double quotes. Single double quotes end the literal
  - r"[""a-z\[\]]+"

- Formatted text literal f"" that allows expressions inside of {}
  - expressions can only be of a type str can be constructed from. any N that can do str(N) works.
  - expressions are highlighted and evaluated based on the literal's scope.
  - they are evaluated in the same order as they are used. all the string parts are evaluated in the same order too. f"a{b}c{d}" evaluates in the order: a, b, c, d
  - same as normal text literals but {} require escaping. {{ and }} instead of { and }

  - float result = 9.45643"
  - f"The result is: { result } :3"

  - int exampleExitValue = 20;
  - io.print(f"int main(){{ return { exampleExitValue }; }})"

  - io.print(f"nested { f"""{ "str" }" "ing\"" } literal");

  - ADD A DISCLAIMER IN THE DOCUMENTATION
  - The language allows literals to have unlimited nesting. It's up to the developer to not abuse this feature and write mainainable code

  - //FIXME add this to the internal functioning - documentation
  - //FIXME format strings are technically not types of literals/tokens but part of the syntactic sugar
  - //FIXME the r prefix only enforces {{ and }} syntax. it doesn't do anything else on its own

  - //FIXME extraction of the expressions is done in the tokenization phase as special syntactic sugar stuff. It becomes multiple tokens. 
  - //FIXME converted to string concatenations.f"a{b}c{d}" becomes ("a" + (b) + "c" + (d))



- Automatically optimize string concatenation and other similar operations to use a buffer instead of reallocating every time the final output grows
