CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/strsm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strsm: strsm.c $(HDRS) | $(BIN)
	$(CC) strsm.c -o $(BIN)/strsm -lcublas

clean:
	rm -rf $(BIN)
