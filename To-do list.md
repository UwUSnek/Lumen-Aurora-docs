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







































- revamp all the boring examples
  - use more interesting names and usecases istead of just random variables and numbers























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


- add quad floating point type     (natively supported by llvm, no GPU support)
- add cent and ucent integer types (natively supported by llvm, no GPU support)













void write(rc<file> f, str data) {
  __internal.write(f.data.handle, data);
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
  rc<file> f = { "./test.txt" };
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
    - type{<constructor parameters>};
    - `int n = int{ 7 };`
  - primitive types and structs that don't specify a constructor get a default constructor that takes a value for each member.
  - the type can be omitted in contexts where a specific type is required.
    - `struct s { int n; }`
    - `void f(s value){}`
    - `f({ s{ 5 } });  // ok, explicit constructor call`
    - `f({ 5 });       // ok, type is omitted`

- read-only pointers
  - pointers can be read-only.
  - raw pointers: `t*`
    - no arc metadata. just a simple 64bit address
  - read-only pointers: `t^`
    - means "whatever is at the left is read only"
    - works just like the read/write version, but doesn't allow assigning values to the underlying data
  - implicit conversions
    - read-write pointers can freely convert into read-only pointers

- other additions
  - struct members can be accessed through pointers directly
    - uses the dot syntax just like namespace paths and normal struct value member access
    - member access through read-only pointers return read-only values (cannot be assigned to. just like normal dereferencing of a RO pointer)
    - works just fine with arc pointers
  - pointers don't have a [] by default. only dereference and arithmetics (unsafe)
    - values that come from dereferenced read-only pointers cannot be assigned to
  - structs can use export directives just like modules. these define what is visible to external code
    - this fully replaces the public/private modifier system of other languages
    - protected and friend not needed as inheritance is not a thing
    - by default, no member is visible. an export directive is required in order to expose them




- add named parameters
  - use = just like assignments
  - assignment doesn't return the value like in c. if needed, people can define their own custom operator that does that

  void f(int a, int b) {
    ...
  }
  void main() {
    f(b = 6, a = 2);
  }


- try expression should consider the code it contains to be in its parent scope
  - it's an expression so it can be used anywhere expressions are allowed
  - works just like an instantly called function literal

- construct directives consider the code to be in their own module
  - any output to stdout replaces the directive



- void pointers
  - forbidden - replaced by templates
  - void type can still be used as template parameters

- global stuff to specify
  - global variables can be of any type
  - thread safety depends on the type. primitives are not thread safe unless wrapped in a thread-safe wrapper
  - globals in each module are initialized in the order they are declared in
    - statements can access any global from anywhere
    - statements in functions used to initialize globals follow the usual uninitialized value rules - can't use globals declared after it
      - this propagates through the call stack
  - all globals of a module are initialized when the module is first imported within the import tree.
    - circular dependencies are allowed, in which case the order within the cycle is not defined
    - circular dependencies between initializer values are not allowed
  - globals are destroyed in inverse oder when the program ends





- ^ is a read-only pointer
  - pointer conversions are valid even within other types
  - atomic<int*> can convert into atomic<int^> freely

- unsafe keyword
  - can be used to specify unsafe blocks
  - can also be used in the definition of a function or operator to mark it as unsafe
  - unsafe expressions are expressions that return the value they contain unchanged
  - unsafe statements are statements that run all of the statements they contain. same syntax as an unnamed scope
  - pointer arithmetics and arbitrary conversions are restricted to unsafe {}
  - editor syntax highlight should color unsafe blocks in bright red or something as visible
  - the IDE extension should make unsafe operations within unsafe blocks very visible - color them bright red or something

- __internal standard module
  - contains stuff that binds directly to llvm's and c's low level operations. no actual function bodies
  - mostly used by standard modules.
  - every routine in here is marked as unsafe
  - imported by default. language features can depend on it
  - DROP THE WHOLE AUTO-IMPORTED-"CORE MODULE" CONCEPT

- atomic standard module
  - provides the atomic struct template (limited to raw pointers and primitive types)
    - compiler does some magic to make it actually atomic and let it hold values
    - `struct atomic{ constructor(atomic<t>* value) when(false) {} /* delete copy constructor */ }`
  - provides the Ordering enum
    - enum `enum Ordering : int { Sequential, Release, Aquire, AquireRelease, Relaxed }`
    - sequential - all threads agree on a global order
    - release, aquire, releaseAquire - 2 threads agree on a specific order
    - relaxed - free for all, no ordering guarantees
    - sequential and release/aquire interact with each other
    - relaxed is fully independent. doesn't interact with sequential and aquire/release at all
  - provides:
    - function `void fence(Ordering ordering)`
  - provides:
    - function `t load(atomic<t?>* a, Ordering ordering)`
    - function `void store(atomic<t?>* a, t value, Ordering ordering)`
    - function `t exchange(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t compareExchange(atomic<t?>* a, t expected, t value, Ordering ordering)`
    - function `t add(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t sub(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t and(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t nand(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t or(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t xor(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t max(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t min(atomic<t?>* a, t value, Ordering ordering) // returns old value in a`
    - function `t increment(atomic<t?>* a, t value, Ordering ordering) // increment by 1. returns old value in a`
    - function `t decrement(atomic<t?>* a, t value, Ordering ordering) // decrement by 1. returns old value in a`
  
- other standard modules provide wrappers for pipes, semaphore, mutexes

- resource standard module

  template<t, counter_t> truct __internal_rc {
    t* data;
    counter_t* count;

    constructor(__internal_rc<t, counter_t>* value) when(counter_t:isAtomic) { // copy constructor takes the address of the data to copy
      data = value.data; // . can access members through pointers directly
      count = value.count;
      count->increment(.Sequential); //.Sequential is automatic enum scoping
    } when(!counter_t:isAtomic) {
      data = value.data; // . can access members through pointers directly
      count = value.count;
      ++@count;
    }
    template<u...> constructor(u params...) { // template pack + function pack, they expand automatically
      data = unsafe{ __internal.malloc(t:size); } // : is a reflection path
      unsafe{ __internal.call_constructor(data, params); }; // internal call_constructor is magic and can call constructors it in-place without copying
      count = unsafe{ __internal.malloc(counter_t:size); };
      unsafe{ __internal.call_constructor(count, 1); }; // internal call_constructor is magic and can call constructors it in-place without copying
    }
    destructor() when(counter_t:isAtomic) {
      if(count->decrement(.Sequential) == 1) {
        unsafe{ __internal.call_destructor(data); };
        unsafe{ __internal.free(data); };
        unsafe{ __internal.free(count); };
      }
    } when(!counter_t:isAtomic) {
      if(--@count == 0) {
        unsafe{ __internal.call_destructor(data); };
        unsafe{ __internal.free(data); };
        unsafe{ __internal.free(count); };
      }
    }

    // you can access and copy the contained data freely, but that will create a copy without arc semantics
    // this generates an error if the struct type is arc-bound
    export data;
  }

  template<t> alias __internal_rc<t, atomic<ulong>> as arc; // atomic refere counted
  template<t> alias __internal_rc<t,        ulong > as  rc; // non-atomic reference counted

  void main() {
    arc<file> f = { "./test.txt" };
    // can access whatever you need using f.data.[...]
    // file gets closed here
  }




- add compiler annotations
  - tell the compiler specific things about routines and structs
  - they start with : and must be specified after the name of the element
  - available annotations for structs:
    - `:nocopy` cannot be copied. only pointer member access is allowed
      - does not propagate to the pointer types
      - this forces any struct with default constructor containing this type to be declared as `:nocopy`
      - template struct instantiations with default constructor that specify members of `:nocopy` struct type are implicitly `:nocopy`
      - can be ignored inside of unsafe blocks
  - available annotations for routines (functions and operators):
    - `:noconst` cannot be used to calculate constant expressions (compile-time values usable in language syntax; think of `break n;`), but doesn't necessarily perform runtime-only operations
      - can never be ignored
    - `:runtime` the routine is considered to perform runtime-only operations even if the compiler can't detect any (impliest `:noconst`)
      - effectively disables compile time optimizations
      - can never be ignored
    - `:unsafe` marks a routine as unsafe. unsafe routines can only be called within unsafe{} blocks.
  - the IDE extension should make unsafe operations within unsafe blocks very visible - color them bright red or something

- functional standard module
  - the language allows taking the address of any function by specifying their path without a parameter list
    - this returns an __internal.fptr_call_data with the right type list (required for type checks)
    - the compiler automatically allocates(stack or heap, compiler decides) the list of captured values as a custom-made plain struct and saves it as a char*
    - no allocations are performed if nothing is captures
      template<t...> struct fptr_call_data{
        char* addr;
        char* captures;
        ulong captures_size;

        // no explicit constructor. compiler allocates stuff and sets them directly
        constructor(fptr_call_data<t>* e) {
          addr = e.addr;
          captures_size = e.captures_size;
          if(captures_size > 0) {
            captures = unsafe{__internal.malloc(captures_size)};
            unsafe{ __internal.memcpy(captures, e.captures, captures_size) };
          }
        }

        destructor() {
          if(captures_size > 0) {
            unsafe{__internal.free(captures)};
          }
        }
      }
  - struct literals are rewritten by the compiler
    - this step makes them manually unpack the captures buffer to use it as parameters
    - this is done through llvm's getelementptr instruction
    - their types don't need to be saved anywhere because the logic in the function body already handles types and conversions from the char*
    - constructors and destructors of the packed parameters are always called after unpacking and before the return. 
      - slightly counter intuitive but necessary. needs to be documented well
      - this is needed to maintain consisten ref counts
  - in functional:
    template<ret_t, args_t...> struct fn {
      __internal.fptr_call_data<ret_t, args_t> call_data;
      constructor(__internal.fptr_call_data<ret_t, args_t> _call_data) {
        call_data = _call_data;
      }

      ret_t run(args_t args...) {
        return unsafe{ __internal.call(call_data.addr, args, call_data.captures); };
      }
    }

- asyncs returns __internal.atomic_ptr^
  - this is a read-only pointer to an atomic pointer containing the address of the return data.
  - becomes non-null after the function returns
  - this is convoluted but the "future" standard module provides a future struct that takes it as a constructor
    - final syntax becomes: `future<int> r = async add(5, 6);`
    - future has .poll and other useful methods that call internal stuff to work

- drop buffer constructor calls
  - just have standard types handle the memory manually with __internal malloc and free and call_constructor calls










- each value in expression trees carries this Information
  - known to the programmer
    - writeable: true/false (can be assigned to)
    - constant: true/false (can be used for constant expressions)
    - can use addr on it: true/false (only true for variables and routine parameters)
  - compiler internals
    - computable in compile time: true/false (used for optimization)
    - stored: true/false (has an address. temporary values don't have one)
    - //TODO def needs other stuff





























































- make examples and syntax blocks full-width
- even though the right block itself is limited to 800px




- Aurora should probably compile straight to SPIR-V
  - SPIR-V is the intermediate language between front-end shading languages and Vulkan shader binaries
  - just like Lumen compiles to LLVM, the intermediate between front ends and CPU binary format
  - Vulkan's library is required. It's written in C.
  - might need to call it from LLVM or from a dedicated Lumen wrapper

- Lumen still needs a way to call/define C functions.
  - this is required in order to use external C libraries such as Vulkan
  - might need a magic implementation in __internal




































- The languages should define vectors and matrices for all primitive types
  - standard operators are defined in __internal
  - more compelx operations such as dot, cross, etc are defined in the stanard module math
  - add a whole section for vectors and matrices. this can be called "tensors"
  - more generic but slower tensors can be found in the stanrad module "tensor"




- add a "reflection data" tab or table in the details tab of each symbol declaration
  - the "reflectin" section only talks about reflection in a generic way. the list of available stuff is available in each symbol's documentation details