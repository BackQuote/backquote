cmake_minimum_required(VERSION 3.7)
project(backtester)

set(CMAKE_CXX_STANDARD 14)

set(SOURCE_FILES
        algorithms/Algorithm.cpp
        algorithms/Algorithm.h
        algorithms/Simple.cpp
        algorithms/Simple.h
        algorithms/stdafx.h
        external_dependencies/ctpl_stl.h
        external_dependencies/json.hpp
        models/action.h
        models/day.h
        models/models.h
        models/quote.h
        models/result.cpp
        models/result.h
        models/status.h
        models/stdafx.h
        models/trade.cpp
        models/trade.h
        utilities/constants.h
        stdafx.cpp
        stdafx.h
        TickerBacktester.cpp
        backtester.cpp)

find_package (Threads)
add_executable(backtester ${SOURCE_FILES})
target_link_libraries (backtester ${CMAKE_THREAD_LIBS_INIT})