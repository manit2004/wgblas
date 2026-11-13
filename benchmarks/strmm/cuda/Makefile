CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/strmm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strmm: strmm.c $(HDRS) | $(BIN)
	$(CC) strmm.c -o $(BIN)/strmm -lcublas

clean:
	rm -rf $(BIN)
