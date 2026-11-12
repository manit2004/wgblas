CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/strmv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strmv: strmv.c $(HDRS) | $(BIN)
	$(CC) strmv.c -o $(BIN)/strmv -lcublas

clean:
	rm -rf $(BIN)
