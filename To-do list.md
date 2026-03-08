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

- Move operators' reference parameters to syntactic sugar

- fix syntax notes

- add call types. defer statement is one of them
  - call (default, redundant. only used for clarity)
  - defer
  - async (returns an Atomic<t*>^. RO pointer to an atomic pointer. The atomic pointer is set to non-null by the new thread after it returns)
    - Standard modules and implementations handle polling, waiting and other synchronization strategies. all based on the atomic pointer
  - compute (run an aurora gpu shader)

- ADD CALL TYPE (optional) SPECIFIER TO FUNCTION CALL SYNTAX

- rename compile-time values to CONSTANT VALUES:
  - either a literal, a value template argument or a const variable.
  - const variables can only be initialized with constant values.
  - routines can be called, but ones that depend on non-const values are detected and cannot be used to create const values (this is logged as error)
  - specify that values that can be computed in compile time are compile time values but cannot be used for const values. these are only used for optimization

- Atomic types built on top of LLVM's Atomics
  - basically free, just copy llvm 1:1

- add process to standard modules
  - creates a new process
  - process("path/to/executable", "option1", "option2");
- add error types to standard modules
  - Error/Success
  - Optional
  - other similar stuff.

- add Shared syntax and stuff





- add constructors - equivalent of copy constructor replaces the default "copy-every-byte" behaviour
  - can be called or optimized out by the compiler as it sees fit


- add function values to documentation
  - rename them to something else. function value should only mean "a value of function type"
- add function literals to documentation
- add function values as a syntax to initialize elements of buffers separately - function takes the index






- add this somewhere in the documentation
  - The language is meant to be handy, readable and powerful. Not idiot-proof.
  - You are given sharp tools and you are expected to know how not to cut yourself, though the compiler will do its best to provide first aid.














import __internal;


resource struct file {
  ulong handle;

  constructor(str path, str permissions = "rw") {
    handle = __internal.open(path, permissions);
  }

  destructor() {
    __internal.close(handle);
  }

  // no export directive, so handle is not visible from the outside
}

void write(file^ f, str data) {
  __internal.write(f.handle, data);
}


struct float2 {
  float x;
  float y;

  constructor() {
    x = 0;
    y = 0;
  }
  constructor(float _x, float _y) {
    x = _x;
    y = _y;
  }

  export x, y;
}

float dot(float2 a, float2 b) {
  return a.x * b.x + a.y * b.y;
}




int main() {
  file^ f;
  // write(f, "hi") // error, f might not be initialized here
  f = resource file{ "./test.txt" };
  f->write("hello");
  f->write(str{ float2{ 5, 6 }->dot(float2{ 9, -1 }) });
}





- language-level assignments
  - the = meta keyword is part of the language. valid anywhere (it's a meta keyword so the = character can still be used in identifiers)
  - operators cannot be called "=" only. == += and others are allowed.
  - by default, assignments simply copy the value at their right into the value at their left.
    - deep copy of every byte in the data. pointers are copied by-value, without duplicating the pointed data.
    - this can be changed using struct constructors.
  - if you want to share a value with other functions, pass its address as a pointer
    - this lets other functions access it but it doesn't extend its lifetime. it will still get destroyed when it runs out of its original scope

- initialization
  - variables and members can be left uninitialized, but:
    - constructors must initialize all of them
    - values can only be passed to routines, dereferenced or have its members accessed through "." if the compiler is certain they are initialized there
  - compiler should generate errors if it detects raw pointers assigned to external variables or passed to other threads
    - this is only allowed inside of the unsafe{} block
  - so the programmer never has to deal with uninitialized values at runtime. anything is detected during compilation, creating errors

- constructors and destructors
  - special functions tied to the struct value's lifetime
  - a struct can define multiple constructors in order to accept different initializer values
    - constructors allow specialization and templates. name resolution is identical to normal functions
    - one of the constructors is called when a new value is created (using a constructor call)
    - if no constructor is defined, a default one is generated for the struct. this constructor takes one argument for each struct member.
  - a struct can define a single destructor
    - the destructor is called when the struct value goes out of scope
    - there is no default destructor

- constructor calls
  - new values can be created using constructor calls
  - the compiler decides if to put them on the stack or the heap, programmer doesn't need to care about that
  - value constructor calls return the value itself
    - type{<constructor parameters>};
    - `int n = int{ 7 };`
  - buffer constructor calls return a rw pointer to the first element. they also accept an initializer function which is passed the index of the element being initialized
    - type[number]{<constructor parameters or initializer function>};
    - `int* p = int[9]{ 7 };`
    - `int* p = int[6]{ int(ulong i){ return i * 2;} };`
  - resource constructor calls always return the rw arc pointer of the first element (or the value)
    - resource <normal constructor call>;
    - `int^ p = resource int[98]{ 12 }; // a resource buffer of 98 ints initialized to value 12`
  - primitive types and structs that don't specify a constructor get a default constructor that takes a value for each member.
  - the type can be omitted in contexts where a specific type is required.
    - `struct s { int n; }`
    - `void f(s value){}`
    - `f({ s{ 5 } });  // ok, explicit constructor call`
    - `f({ 5 });       // ok, type is omitted`

- arc and read-only pointers
  - pointers can be arc and/or read-only.
  - raw pointers: `t*`
    - no arc metadata. just a simple 64bit address
  - arc pointers: `t^`
    - has arc metadata. used to handle resources.
    - reference counter is updated on direct assignment.
    - arc pointers bind to the resource they were created for or to the resource associated with the arc pointer that was last assigned to them
    - cannot be dereferenced if pointing to a resource struct
  - read-only raw/arc pointers: `t~*` `t~^`
    - ~ means "whatever is at the left is read only". ~ reads as "locked/unmodifiable"
    - works just like the read/write version, but doesn't allow assigning values to the underlying data
  - implicit conversions
    - arc pointers can freely convert into raw pointers, losing resource tracking metadata. these don't count as a resource reference.
    - read-write pointers can freely convert into read-only pointers, maintaining their raw/arc status.

- resources and resource-only structs
  - normally, values are owned by the function that creates them.
    - they cannot escape the scope in which they were created. Other threads and functions only see copies
    - they are destroyed as soon as they run out of scope.
  - resources are special values that can escape their scope
    - data of any type can be a resource, including primitive types. the only exception is void
    - resources are created by putting the resource keyword before the constructor call. this returns an arc pointer associated with the new resource
    - the data can only be accessed through arc pointers associated with it
    - ownership is shared between all threads and functions that use arc pointers associated with a resource
    - resources can escape and outlive their scope if one of the arc pointers associated with it is assigned to globals or passed to other threads
    - the value is destroyed after all of the referencing arc pointers run out of scope (meaning the value is inaccessible)
    - circular dependencies are the programmer's responsibility. they can create memory leaks. don't do that.
    - a struct can be declared as "resource"
      - a resource struct can only be created through a resource constructor call
      - pointers to resource structs cannot be dereferenced

- other additions
  - struct members can be accessed through pointers directly
    - uses the dot syntax just like namespace paths and normal struct value member access
    - member access through read-only pointers return read-only values (cannot be assigned to. just like normal dereferencing of a RO pointer)
    - works just fine with arc pointers
  - pointers have a [] operator from the standard module.
    - returns the address of the element at the specified index
    - subscription of read-only pointers returns a read-only pointer
    - subscription of an arc pointer returns an arc pointer that tracks the same resource
  - pointer arithmetics and arbitrary conversions are restricted to unsafe {}
    - unsafe block means "i know what im doing, i take full responsibility. compiler, give me unlimited power"
    - "unsafe blocks" are a kind of expression, not a statement.
    - it can be used within expressions and can be thought of as returning whatever expression it contains, unchanged.
    - this is valid: `int* p = unsafe{ int*{ 0x71b64a } };`
    - this is also valid: `int* p2 = p[unsafe{ p + 5 * p }];`
      - at this point you are playing with fire while covered in gasoline
      - the unsafe block is there so the compiler trusts you know what you are doing and lets you do it without questions
    - also needed to make raw pointer values escape their parent scope












- each value in expression trees carries these informations
  - known to the programmer
    - writeable: true/false (can be assigned to)
    - constant: true/false (can be used for constant expressions)
    - can use addr on it: true/false (only true for variables and routine parameters)
  - compiler internals
    - computable in compile time: true/false (used for optimization)
    - stored: true/false (has an address. temporary values don't have one)
