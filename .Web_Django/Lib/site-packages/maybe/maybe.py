from __future__ import annotations

import functools
from typing import Any, Union, Tuple, Callable, Type, cast, TypeVar

FuncSig = TypeVar("FuncSig", bound=Callable)


class MissingValue:
    def __repr__(self) -> str:
        return type(self).__name__


missing = MissingValue()


def _set_value_ignoring_exceptions(exception_types: Union[Type[Exception], Tuple[Type[Exception]]] = Exception) -> Callable[[FuncSig], FuncSig]:
    def decorator(func: FuncSig) -> FuncSig:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            instance = args[0]

            if instance._value_ is not missing:
                try:
                    instance._value_ = func(*args, **kwargs)
                except exception_types:
                    instance._value_ = missing

            return instance

        return cast(FuncSig, wrapper)
    return decorator


class Maybe:
    """
    A class which serves as a pseudo-implementation of null-aware operators in python. Provides null-aware item access, null-aware attribute access, null-aware chained method calls,
    and can be combined with all arithmetic and bitwise operators
    """

    def __init__(self, val: Any) -> None:
        self._value_ = val if val is not None else missing

    def __repr__(self) -> str:
        return f"{type(self).__name__}({repr(self._value_)})"

    def __bool__(self) -> bool:
        return self._value_ is not missing

    def __getattr__(self, name: str) -> Maybe:
        try:
            self._value_ = getattr(self._value_, name)
        except AttributeError:
            if not (name.startswith("_") and "ipython" in name.lower()):
                self._value_ = missing
        finally:
            return self

    @_set_value_ignoring_exceptions((KeyError, IndexError))
    def __getitem__(self, key: str) -> Maybe:
        return self._value_[key]

    @_set_value_ignoring_exceptions(TypeError)
    def __call__(self, *args: Any, **kwargs: Any) -> Maybe:
        return self._value_(*args, **kwargs)

    @_set_value_ignoring_exceptions(TypeError)
    def __add__(self, other: Any) -> Maybe:
        return self._value_ + other

    @_set_value_ignoring_exceptions(TypeError)
    def __radd__(self, other: Any) -> Maybe:
        return other + self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __sub__(self, other: Any) -> Maybe:
        return self._value_ - other

    @_set_value_ignoring_exceptions(TypeError)
    def __rsub__(self, other: Any) -> Maybe:
        return other - self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __mul__(self, other: Any) -> Maybe:
        return self._value_ * other

    @_set_value_ignoring_exceptions(TypeError)
    def __rmul__(self, other: Any) -> Maybe:
        return other * self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __truediv__(self, other: Any) -> Maybe:
        return self._value_ / other

    @_set_value_ignoring_exceptions(TypeError)
    def __rtruediv__(self, other: Any) -> Maybe:
        return other / self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __floordiv__(self, other: Any) -> Maybe:
        return self._value_ // other

    @_set_value_ignoring_exceptions(TypeError)
    def __rfloordiv__(self, other: Any) -> Maybe:
        return other // self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __mod__(self, other: Any) -> Maybe:
        return self._value_ % other

    @_set_value_ignoring_exceptions(TypeError)
    def __rmod__(self, other: Any) -> Maybe:
        return other % self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __and__(self, other: Any) -> Maybe:
        return self._value_ & other

    @_set_value_ignoring_exceptions(TypeError)
    def __rand__(self, other: Any) -> Maybe:
        return other & self._value_

    @_set_value_ignoring_exceptions(TypeError)
    def __or__(self, other: Any) -> Maybe:
        return self._value_ | other

    @_set_value_ignoring_exceptions(TypeError)
    def __ror__(self, other: Any) -> Maybe:
        return other | self._value_

    def else_(self, alternative: Any) -> Any:
        """Return the currently held value if the original was not None and all operations so far on the Maybe construct have been valid, otherwise return the alternative."""
        return self._value_ if self._value_ is not missing else alternative
